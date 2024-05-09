import {
  InvalidCredentialsError,
  InvalidRefreshTokenError,
} from '@bambu/server-core/common-errors';
import { Public } from '@bambu/server-core/common-guards';
import { AuthenticationServiceBase } from '@bambu/server-core/domains';
import { Decorators, ErrorUtils } from '@bambu/server-core/utilities';
import { AuthenticationDto } from '@bambu/shared';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseInterceptors,
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

@ApiTags('Authentication')
@ApiExtraModels(
  Dto.AuthenticationLoginRequestDto,
  Dto.AuthenticationLoginResponseDto,
  Dto.AuthenticationRefreshRequestDto
)
@Controller('auth')
export class AuthenticationController {
  // readonly #logger = new Logger(AuthenticationController.name);
  constructor(
    private readonly authenticationService: AuthenticationServiceBase
  ) {
    // TODO
  }

  @Public()
  @Version('1')
  @Post('guest-login')
  @HttpCode(201)
  @ApiOperation({
    summary:
      'Provides an unidentified user with a set of tokens to access public Colossus resources.',
    description: [
      'Provides an unidentified user with a set of tokens to access public Colossus resources.',
      'By requiring a guest claim for most resources, we have another way to limit abuse from unidentified users',
    ].join(' '),
    operationId: 'GuestLogin',
  })
  @ApiResponse({
    status: 201,
    description:
      'A set of claims for a guest user encoded as an access token, along with a refresh token.',
    schema: {
      $ref: getSchemaPath(Dto.AuthenticationLoginResponseDto),
    },
  })
  public async GuestLogin(): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    return await this.authenticationService.GuestLogin();
  }

  @Public()
  @Version('1')
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Provides an registered user with a set of tokens to identify them to Colossus resources.',
    operationId: 'Login',
  })
  @ApiBody({
    description: 'Input payload.',
    type: Dto.AuthenticationLoginRequestDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'A set of claims for a user encoded as an access token, along with a refresh token.',
    schema: {
      $ref: getSchemaPath(Dto.AuthenticationLoginRequestDto),
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Forbidden. Invalid credentials. Perhaps the username or password is incorrect.',
  })
  public async Login(
    @Body() credentials: AuthenticationDto.IAuthenticationLoginRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    try {
      return await this.authenticationService.Login(requestId, credentials);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      throw error;
    }
  }

  @Public()
  @Version('1')
  @Post('refresh')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: "Refreshes a user's tokens.",
    operationId: 'Refresh',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.AuthenticationRefreshRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.AuthenticationRefreshRequestDto),
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'A set of claims for a user encoded as an access token, along with a refresh token.',
    schema: {
      $ref: getSchemaPath(Dto.AuthenticationLoginResponseDto),
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request. Perhaps the refresh token is invalid or has expired.',
  })
  public async Refresh(
    @Body()
    { refresh_token }: Dto.AuthenticationRefreshRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    try {
      return await this.authenticationService.RefreshJwtToken(
        requestId,
        refresh_token
      );
    } catch (error) {
      if (error instanceof InvalidRefreshTokenError) {
        const error400 = new BadRequestException(
          error.message,
          'INVALID_REFRESH_TOKEN'
        );
        ErrorUtils.handleHttpControllerError(error400);
        Object.assign(error400, { requestId });
      } else {
        Object.assign(error, { requestId });
        ErrorUtils.handleHttpControllerError(error);
      }
    }
  }
}
