import { RegistrationResponse } from '@fusionauth/typescript-client';
import {
  ContentStatus,
  GroupMember,
  User,
  UserRegistration,
  UserTwoFactorConfiguration,
  UUID,
} from '@fusionauth/typescript-client/build/src/FusionAuthClient';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectAdvisorCreateResponseUserRegistrationDto
  implements UserRegistration
{
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  applicationId?: UUID;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  authenticationToken?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  cleanSpeakId?: UUID;

  @ApiProperty({
    type: 'object',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  data?: Record<string, any>;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  id?: UUID;

  @ApiProperty({
    type: 'number',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  insertInstant?: number;

  @ApiProperty({
    type: 'number',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  lastLoginInstant?: number;

  @ApiProperty({
    type: 'number',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  lastUpdateInstant?: number;

  @ApiProperty({
    type: 'string',
    isArray: true,
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  preferredLanguages?: Array<string>;

  @ApiProperty({
    type: 'string',
    isArray: true,
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  roles?: Array<string>;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  timezone?: string;

  @ApiProperty({
    type: 'object',
    isArray: true,
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  tokens?: Record<string, string>;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  username?: string;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
    enum: ContentStatus,
  })
  usernameStatus?: ContentStatus;

  @ApiProperty({
    type: 'boolean',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  verified?: boolean;
}

export class ConnectAdvisorCreateResponseUserDto implements User {
  active?: boolean;
  birthDate?: string;
  cleanSpeakId?: UUID;
  data?: Record<string, any>;
  email?: string;
  expiry?: number;
  firstName?: string;
  fullName?: string;
  imageUrl?: string;
  insertInstant?: number;
  lastName?: string;
  lastUpdateInstant?: number;
  memberships?: Array<GroupMember>;
  middleName?: string;
  mobilePhone?: string;
  parentEmail?: string;
  preferredLanguages?: Array<string>;
  registrations?: Array<UserRegistration>;
  tenantId?: UUID;
  timezone?: string;
  twoFactor?: UserTwoFactorConfiguration;
}

export class ConnectAdvisorCreateResponseDto implements RegistrationResponse {
  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    type: ConnectAdvisorCreateResponseUserRegistrationDto,
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  registration?: ConnectAdvisorCreateResponseUserRegistrationDto;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  registrationVerificationId?: string;

  @ApiProperty({
    type: 'string',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  token?: string;

  @ApiProperty({
    type: 'number',
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  tokenExpirationInstant?: number;

  @ApiProperty({
    type: ConnectAdvisorCreateResponseUserDto,
    externalDocs: {
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
      description: 'Fusion Auth Documentation',
    },
    required: false,
  })
  user?: ConnectAdvisorCreateResponseUserDto;
}
