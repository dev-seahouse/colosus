import {
  AllowEmailUnverified,
  Authenticated,
  Public,
} from '@bambu/server-core/common-guards';
import { TenantServiceBase } from '@bambu/server-core/domains';
import {
  Decorators,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IAccountInitialEmailVerificationRequestDto,
  IamDto,
  SharedEnums,
} from '@bambu/shared';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import * as Dto from './dto';

@ApiTags('Account')
@ApiExtraModels(Dto.AccountInitialEmailVerificationRequestDto)
@Controller('account')
export class AccountController {
  readonly #logger = new Logger(AccountController.name);
  constructor(private readonly tenantService: TenantServiceBase) {
    // TODO
  }

  @Public()
  @Version('1')
  @Post('verify-email-initial')
  @HttpCode(201)
  @ApiOperation({
    summary:
      'Enables a user account with an OTP that should have been sent to their email upon user creation. This only works for users that have been created in KeyCloak. This endpoint is not being used at time of writing and will be deprecated once we have migrated all users to FusionAuth.',
    operationId: 'VerifyEmailInitial',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.AccountInitialEmailVerificationRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.AccountInitialEmailVerificationRequestDto),
    },
  })
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Perhaps the OTP is invalid.',
  })
  public async VerifyEmailInitial(
    @Body()
    {
      tenantName,
      username,
      otp,
    }: Dto.AccountInitialEmailVerificationRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.VerifyEmailInitial.name,
      requestId
    );
    this.#logger.error(
      `${logPrefix} account/verify-email-initial is called but it is a deprecated endpoint that is not being used at time of writing.`
    );
    const tenantId = await this.tenantService.GetTenantIdFromTenantNameSafe(
      requestId,
      tenantName
    );
    if (!tenantId) {
      const missingTenantError = new ErrorUtils.ColossusError(
        `Tenant does not exist for user (${username}).`,
        requestId,
        {
          username,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantError
        )}.`
      );

      throw missingTenantError;
    }
    const result = await this.tenantService.VerifyUserEmailByEmailOtp({
      requestId,
      tenantId,
      tenantName,
      username,
      otp,
    });

    if (!result) {
      throw new BadRequestException('The OTP may be invalid.', 'INVALID_OTP');
    }
  }

  @AllowEmailUnverified()
  @Authenticated()
  @Version('1')
  @Post('change-password')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Change the password of a logged-in user.',
    operationId: 'ChangePassword',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.AccountChangePasswordRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.AccountChangePasswordRequestDto),
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Password Change succeeded.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  public async ChangePassword(
    @Body()
    { newPassword }: Dto.AccountChangePasswordRequestDto
  ): Promise<void> {
    throw new Error('Not implemented');
  }
}
