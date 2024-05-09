import { Roles } from '@bambu/server-core/common-guards';
import {
  TransactAdvisorServiceBase,
  TransactInvestorServiceBase,
} from '@bambu/server-core/domains';
import {
  IColossusTrackingDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  Decorators,
  ErrorUtils,
  IamUtils,
  JsonUtils,
  LoggingUtils,
  MulterUtils,
} from '@bambu/server-core/utilities';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import {
  GetModelPortfolioByIdResponseDto,
  InstrumentAssetClassDto,
  InstrumentsSearchResponseDto,
  TransactModelPortfolioDto,
  TransactPortfolioInstrumentDto,
  TransactPortfolioInstrumentMutableDto,
} from '../transact-investor/dto';
import * as Dto from './dto';

@ApiTags('Transact Advisor')
@ApiExtraModels(TransactModelPortfolioDto, Dto.TenantTransactBrokerageDto)
@Controller('transact/advisor')
export class TransactAdvisorController {
  private logger: Logger = new Logger(TransactAdvisorController.name);

  constructor(
    private readonly transactAdvisorDomain: TransactAdvisorServiceBase,
    /**
     * Doing this to reuse the instruments bit in TransactInvestorServiceBase.
     *
     * Instruments need to be their own domain later at some point.
     */
    private readonly transactInvestorDomain: TransactInvestorServiceBase
  ) {}

  @Roles('Advisor')
  @Version('1')
  @Post('model-portfolio')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Create a model portfolio',
  })
  @ApiBody({
    type: TransactModelPortfolioDto,
  })
  @ApiResponse({
    status: 201,
    type: TransactModelPortfolioDto,
  })
  public async CreateModelPortfolio(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: TransactModelPortfolioDto
  ): Promise<TransactModelPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateModelPortfolio.name,
      tracking.requestId
    );
    try {
      const tenantId = IamUtils.getFusionAuthRealmFromClaims(claims);

      return await this.transactAdvisorDomain.CreateModelPortfolio(
        tracking,
        tenantId,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('model-portfolio')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get model portfolios for tenant',
  })
  @ApiResponse({
    status: 200,
    type: GetModelPortfolioByIdResponseDto,
    isArray: true,
  })
  public async GetModelPortfoliosForTenant(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<GetModelPortfolioByIdResponseDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfoliosForTenant.name,
      tracking.requestId
    );
    try {
      const tenantId: string = IamUtils.getFusionAuthRealmFromClaims(claims);

      return await this.transactAdvisorDomain.GetModelPortfoliosForTenant(
        tracking,
        tenantId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('model-portfolio/:id')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get model portfolio for tenant by id',
  })
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    type: GetModelPortfolioByIdResponseDto,
  })
  public async GetModelPortfoliosForTenantById(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string
  ): Promise<GetModelPortfolioByIdResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfoliosForTenantById.name,
      tracking.requestId
    );
    try {
      const tenantId: string = IamUtils.getFusionAuthRealmFromClaims(claims);
      return await this.transactAdvisorDomain.GetModelPortfoliosForTenantById(
        tracking,
        tenantId,
        id
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Post('model-portfolio/:id/instruments')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get model portfolio instruments for tenant by id',
  })
  @ApiParam({
    name: 'id',
  })
  @ApiBody({
    type: TransactPortfolioInstrumentMutableDto,
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    type: TransactPortfolioInstrumentDto,
    isArray: true,
  })
  public async UpsertTransactModelPortfolioInstrument(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Body() payload: TransactPortfolioInstrumentMutableDto[]
  ): Promise<TransactPortfolioInstrumentDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertTransactModelPortfolioInstrument.name,
      tracking.requestId
    );
    try {
      const tenantId = IamUtils.getFusionAuthRealmFromClaims(claims);

      return await this.transactAdvisorDomain.UpsertTransactModelPortfolioInstruments(
        tracking,
        tenantId,
        id,
        payload.map((instrument) => {
          return {
            ...instrument,
            transactModelPortfolioId: id,
          };
        })
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('instruments/asset-classes')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of asset classes for the investor.',
  })
  @ApiResponse({
    status: 200,
    type: InstrumentAssetClassDto,
    isArray: true,
  })
  public async GetInstrumentAssetClasses(
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<InstrumentAssetClassDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstrumentAssetClasses.name,
      tracking.requestId
    );
    try {
      return await this.transactInvestorDomain.GetInstrumentAssetClasses(
        tracking
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('instruments')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of instruments for the investor.',
  })
  @ApiQuery({
    name: 'pageIndex',
    type: 'integer',
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'integer',
    example: 50,
  })
  @ApiQuery({
    name: 'searchString',
    type: 'string',
    example: '',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: InstrumentsSearchResponseDto,
  })
  public async GetInstruments(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Query('pageIndex', ParseIntPipe) pageIndex = 0,
    @Query('pageSize', ParseIntPipe) pageSize = 50,
    @Query('searchString') searchString?: string
  ): Promise<InstrumentsSearchResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstruments.name,
      tracking.requestId
    );
    try {
      const targetSearchString = searchString ? searchString : '';
      return await this.transactInvestorDomain.GetInstruments(
        tracking,
        pageIndex,
        pageSize,
        targetSearchString
      );
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Post('model-portfolio/:id/fact-sheet')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', MulterUtils.defaultMulterConfig))
  @ApiOperation({
    summary: 'Upload a model portfolio fact sheet',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the model portfolio to upload the fact sheet for.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async UploadModelPortfolioFactSheet(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MulterUtils.MAX_FILE_SIZE_IN_BYTES,
          }),
          new FileTypeValidator({ fileType: MulterUtils.DOCUMENT_MIME_TYPES }),
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UploadModelPortfolioFactSheet.name,
      tracking.requestId
    );
    try {
      const tenantId: string = IamUtils.getFusionAuthRealmFromClaims(claims);

      const loggingPayload = {
        tracking,
        claims,
        tenantId,
        file,
      };
      this.logger.debug(
        `${logPrefix} Logging payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      await this.transactAdvisorDomain.SetModelPortfolioFactSheetDocument(
        tracking,
        {
          modelPortfolioId: id,
          tenantId,
          filePath: file.path,
          fileMimeType: file.mimetype,
          fileName: file.filename,
        }
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    } finally {
      fs.unlink(file.path, (error) => {
        if (error) {
          this.logger.error(
            `${logPrefix} Error: ${JsonUtils.Stringify(error)}`
          );
        } else {
          this.logger.log(`${logPrefix} File ${file.path} deleted`);
        }
      });
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('tenant-transact-brokerages')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get tenant transact brokerage metadata.',
  })
  @ApiResponse({
    status: 200,
    type: Dto.TenantTransactBrokerageDto,
  })
  public async GetTenantTransactBrokerageMetadata(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.TenantTransactBrokerageDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantTransactBrokerageMetadata.name,
      tracking.requestId
    );
    try {
      const tenantId: string = IamUtils.getFusionAuthRealmFromClaims(claims);
      return await this.transactAdvisorDomain.GetTenantTransactBrokerageMetadata(
        tracking,
        tenantId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Post('advisor-bank-account')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiBody({
    type: Dto.TenantTransactBankAccountMutableDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Added bank account for the transact advisor',
  })
  public async AddTransactTenantBankAccount(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.TenantTransactBankAccountMutableDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddTransactTenantBankAccount.name,
      tracking.requestId
    );
    try {
      const tenantId = IamUtils.getFusionAuthRealmFromClaims(claims);
      await this.transactAdvisorDomain.UpsertTransactAdvisorBankAccountDetails(
        tracking,
        tenantId,
        {
          ...payload,
          tenantId,
        }
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('advisor-bank-account')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiBody({
    type: Dto.TenantTransactBankAccountMutableDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Added bank account for the transact advisor',
  })
  public async UpdateTransactTenantBankAccount(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.TenantTransactBankAccountMutableDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateTransactTenantBankAccount.name,
      tracking.requestId
    );
    try {
      const tenantId = IamUtils.getFusionAuthRealmFromClaims(claims);
      await this.transactAdvisorDomain.UpsertTransactAdvisorBankAccountDetails(
        tracking,
        tenantId,
        {
          ...payload,
          tenantId,
        }
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('advisor-bank-account')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: Dto.TenantTransactBankAccountDto,
  })
  public async GetTransactTenantBankAccount(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.TenantTransactBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransactTenantBankAccount.name,
      tracking.requestId
    );
    try {
      const tenantId = IamUtils.getFusionAuthRealmFromClaims(claims);
      return this.transactAdvisorDomain.GetTransactAdvisorBankAccountDetails(
        tracking,
        tenantId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error);
    }
  }
}
