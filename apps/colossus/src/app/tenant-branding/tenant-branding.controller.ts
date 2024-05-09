/// <reference types="multer" />

import { ConnectAdvisorServiceBase } from '@bambu/server-connect/domains';
import {
  ExtractOriginGuard,
  Public,
  Roles,
} from '@bambu/server-core/common-guards';
import {
  TenantBrandingServiceBase,
  TenantServiceBase,
} from '@bambu/server-core/domains';
import {
  IColossusTrackingDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import { ConnectTenantGoalTypeCentralDbRepositoryService } from '@bambu/server-core/repositories';
import {
  Decorators,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { TenantBrandingDto } from '@bambu/shared';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpCode,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { promises as fsPromises } from 'fs';
import * as Dto from './dto';

const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 2; // 2MiB
// Note: duplicate of the same variable in src/app/connect-advisor/connect-advisor.controller.ts
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const IMAGE_MIME_TYPES = /image\/(apng|gif|jpeg|png|svg\+xml|webp)/;

@ApiTags('Branding')
@ApiExtraModels(Dto.TenantBrandingScalarsDto, Dto.TenantBrandingDto)
@Controller('tenant/branding')
export class TenantBrandingController {
  readonly #logger = new Logger(TenantBrandingController.name);

  constructor(
    private readonly tenantService: TenantServiceBase,
    private readonly tenantBrandingService: TenantBrandingServiceBase,
    private readonly connectTenantGoalTypeCentralDbRepository: ConnectTenantGoalTypeCentralDbRepositoryService,
    private readonly connectAdvisorDomain: ConnectAdvisorServiceBase
  ) {}

  @ApiBearerAuth()
  @Roles('Vendee-Admin')
  @Version('1')
  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Set branding info for a tenant.',
    operationId: 'SetTenantBranding',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.TenantBrandingScalarsDto,
    schema: {
      $ref: getSchemaPath(Dto.TenantBrandingScalarsDto),
    },
  })
  public async SetTenantBranding(
    @Body() branding: Dto.TenantBrandingScalarsDto,
    @Req() httpRequest: Request & { claims: IServerCoreIamClaimsDto },
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const {
        claims: { realm: tenantRealm },
      } = httpRequest;

      const tenantId = await this.tenantService.GetTenantIdFromTenantName(
        httpRequest.claims.realm
      );

      await Promise.all([
        this.tenantBrandingService.SetBranding({
          ...branding,
          tenantId,
          tracking,
          trackPlatformSetupProgress: true,
        }),
        this.connectAdvisorDomain.FlushInvestorPortalCachedHtml(
          tracking.requestId,
          tenantRealm
        ),
      ]);
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @ApiBearerAuth()
  @Roles('Vendee-Admin')
  @Version('1')
  @Delete('logo')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete the uploaded logo associated with the tenant.',
    operationId: 'DeleteTenantLogo',
  })
  public async DeleteTenantLogo(
    @Req() httpRequest: Request & { claims: IServerCoreIamClaimsDto },
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      httpRequest.claims.realm
    );
    await this.tenantBrandingService.DeleteLogo({ tenantId, tracking });
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Roles('Vendee-Admin')
  @Version('1')
  @Post('logo')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  @ApiOperation({
    summary: 'Upload a Logo for use by a tenant.',
    operationId: 'UploadTenantLogo',
  })
  public async UploadTenantLogo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES }),
          new FileTypeValidator({ fileType: IMAGE_MIME_TYPES }),
        ],
      })
    )
    file: Express.Multer.File,
    @Req() httpRequest: Request & { claims: IServerCoreIamClaimsDto },
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const { requestId } = tracking;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UploadTenantLogo.name,
      requestId
    );

    try {
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(
          httpRequest.claims.realm
        );

      this.#logger.debug(
        `${logPrefix} Uploading logo for tenant ${tenantId} from ${file.path}... having mimetype ${file.mimetype} and original name ${file.originalname}`
      );

      await this.tenantBrandingService.UploadLogo({
        tenantId,
        filePath: file.path,
        originalFilename: file.originalname,
        contentType: file.mimetype,
        tracking,
      });
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error uploading logo for tenant ${httpRequest.claims.realm} from ${file.path}`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      ErrorUtils.handleHttpControllerError(error);
    } finally {
      void fsPromises
        .unlink(file.path)
        .catch((err) => {
          const message = [
            `${logPrefix} Error deleting file ${file.path}.`,
            `Details: ${JsonUtils.Stringify(err)}.`,
          ].join(' ');
          this.#logger.error(message);
        })
        .then(() => {
          this.#logger.debug(`${logPrefix} Deleted ${file.path}`);
        });
    }
  }

  @Public()
  @UseGuards(ExtractOriginGuard)
  @Version('1')
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Returns branding info for a tenant.',
    operationId: 'GetTenantBranding',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'ignored if set from swagger explorer, please use origin-override instead',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'overrides the origin header used for resolving the tenant, in dev environment',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Branding info for a tenant.',
    type: Dto.TenantBrandingDto,
  })
  public async GetTenantBranding(
    @Decorators.RequestId() requestId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<TenantBrandingDto.ITenantBrandingDto> {
    const tenant =
      await this.connectTenantGoalTypeCentralDbRepository.GetTenantFromUrl(
        origin,
        requestId
      );
    return await this.tenantBrandingService.GetBranding({
      tenantId: tenant.id,
    });
  }
}
