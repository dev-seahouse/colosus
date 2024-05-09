import { ConnectAdvisorDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ConnectAdvisorProfileInformationSubscriptionDto
  implements ConnectAdvisorDto.IConnectAdvisorProfileInformationSubscriptionDto
{
  @ApiProperty({
    enum: SharedEnums.BambuGoProductIdEnum,
    description: 'Bambu product code.',
    example: SharedEnums.BambuGoProductIdEnum.CONNECT,
  })
  productCode: string;

  @ApiProperty({
    type: 'string',
    example: 'price_1Mq9D7FabpOjRn7HWILE9Cro',
    description: 'Product identifier from payment gateway provider.',
  })
  productId: string;

  @ApiProperty({
    type: 'string',
    example: 'sub_1MreQNFabpOjRn7HzkhFRmQp',
    description: 'Subscription identifier from payment gateway provider.',
  })
  subscriptionId: string;

  @ApiProperty({
    enum: SharedEnums.BambuGoProductIdEnum,
    description: 'Bambu product code.',
    example: SharedEnums.BambuGoProductIdEnum.CONNECT,
    type: 'string',
  })
  bambuGoProductId: SharedEnums.BambuGoProductIdEnum;

  @ApiProperty({
    enum: SharedEnums.BambuGoProductIdEnum,
    description: 'Bambu product code.',
    example: SharedEnums.BambuGoProductIdEnum.CONNECT,
    type: 'boolean',
  })
  isInterestedInTransact: boolean;
}

export class ConnectAdvisorProfileInformationSetupStateDto
  implements ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto
{
  @ApiProperty({
    type: 'boolean',
    example: false,
    description: `Whether the advisor has updated their branding.`,
    required: true,
  })
  hasUpdatedBranding: boolean;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: `Whether the advisor has updated their content.`,
    required: true,
  })
  hasUpdatedContent: boolean;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: `Whether the advisor has updated their goals.`,
    required: true,
  })
  hasUpdatedGoals: boolean;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: [
      `Whether the advisor has updated their lead settings.`,
      `This is set in the settings page in the advisor screen.`,
    ].join(' '),
  })
  hasUpdatedLeadSettings: boolean;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: `Whether the advisor has updated their portfolios.`,
    required: true,
  })
  hasUpdatedPortfolios: boolean;
}

/**
 * Note: Using Omit here to exclude fields that should be inferred from the access token.
 * TODO: Consider using a generic utility type to systematically exclude these fields where applicable.
 */
export class ConnectAdvisorProfileInformationDto
  implements
    ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
    Pick<ConnectAdvisorDto.IConnectAdvisorLoginRequestDto, 'username'>
{
  @ApiProperty({
    type: 'string',
    format: 'uri',
    example: 'https://www.bambu.life',
    description: 'Link to the contact page of the tenant.',
    default: null,
    deprecated: true,
  })
  @IsString()
  @IsOptional()
  contactLink?: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'uri',
    example: 'https://me.external.com/profile',
    description: `A URL to the advisor's profile on an external website.`,
    default: null,
  })
  @IsString()
  @IsOptional()
  fullProfileLink?: string | null = null;

  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    required: false,
    description: `A URL to an image file displaying the advisor's portrait.`,
  })
  advisorProfilePictureUrl?: string | null;

  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    required: false,
    description: `A URL to an image file displaying the advisor's portrait.`,
  })
  advisorInternalProfilePictureUrl?: string | null;

  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description: 'The username of the advisor.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    example: '51007cd5-2a5f-4507-aa67-a2bf6994c023',
    description: 'The UUID by which the advisor is identified on the platform.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Whether the advisor has been verified.',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  emailVerified: string | boolean;

  @ApiProperty({
    type: 'string',
    example: 'foo_eggs_at_bar_com',
    description: 'The tenant realm on the platform.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tenantRealm: string;

  @ApiProperty({
    type: 'string',
    example: 'Ashley',
    description: 'The first name of the advisor.',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Smith',
    description: 'The last name of the advisor.',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: 'Financial Advisor',
    description: "The advisor's job title.",
    required: true,
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    type: 'string',
    example: 'USA',
    description:
      "The advisor's country of residence as an ISO 3166-1 alpha-3 code (three-letter country code).",
    required: true,
  })
  @IsString()
  countryOfResidence: string;

  @ApiProperty({
    type: 'string',
    example: 'Gre@t Adv1sor Pte Ltd',
    description: 'The legal name of the company where the advisor is employed.',
    required: true,
  })
  @IsString()
  businessName: string;

  @ApiProperty({
    type: 'string',
    example: 'Detroit',
    required: false,
    description: `The region of the country where the advisor resides.`,
  })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({
    type: 'boolean',
    example: false,
    description: 'Denotes if a user has subscriptions or not.',
    required: true,
  })
  @IsBoolean()
  hasActiveSubscription: boolean;

  @ApiProperty({
    type: ConnectAdvisorProfileInformationSubscriptionDto,
    isArray: true,
    description: 'List of subscriptions for user.',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(0)
  subscriptions: ConnectAdvisorProfileInformationSubscriptionDto[];

  @ApiProperty({
    type: 'subdomain',
    example: 'wa-x',
    required: false,
    description: `The subdomain identifying the tenant.`,
  })
  subdomain: string | null;

  @ApiProperty({
    type: 'string',
    example: '<p>Example <strong>Text</strong></p>',
    required: false,
    description: `Sanitized HTML for use in TipTap or other WYSIWYG editor describing the advisor's bio.`,
  })
  profileBioRichText?: string | null;

  @ApiProperty({
    type: 'string',
    example: '<p>Example <strong>Text</strong></p>',
    required: false,
    description: `Sanitized HTML for use in TipTap or other WYSIWYG editor describing reasons to contact the advisor.`,
  })
  contactMeReasonsRichText?: string | null;

  @ApiProperty({
    type: ConnectAdvisorProfileInformationSetupStateDto,
    description: `The setup status of the advisor's profile.`,
    required: false,
  })
  platformSetupStatus?: ConnectAdvisorProfileInformationSetupStateDto;
}
