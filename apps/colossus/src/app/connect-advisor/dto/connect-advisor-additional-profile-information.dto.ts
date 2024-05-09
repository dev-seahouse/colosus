import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ConnectAdvisorDto } from '@bambu/shared';

/**
 * Note: Using Omit here to exclude fields that should be inferred from the access token.
 * TODO: Consider using a generic utility type to systematically exclude these fields where applicable.
 */
export class ConnectAdvisorAdditionalProfileInformationDto
  implements
    Omit<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      | 'userId'
      | 'tenantRealm'
      | 'subscriptions'
      | 'hasActiveSubscription'
      | 'profileBioRichText'
      | 'contactMeReasonsRichText'
      | 'fullProfileLink'
      | 'advisorProfilePictureUrl'
      | 'platformSetupStatus'
    >
{
  @ApiProperty({
    type: 'string',
    example: 'Ashley',
    description: 'The first name of the advisor.',
    required: true,
  })
  @IsString()
  @MinLength(1, { message: 'Your first name is required.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'Smith',
    description: 'The last name of the advisor.',
    required: true,
  })
  @IsString()
  @MinLength(1, { message: 'Your last name is required.' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: 'string',
    example: 'Financial Advisor',
    description: "The advisor's job title.",
    required: true,
  })
  @IsString()
  @MinLength(1, { message: 'Your job title is required.' })
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({
    type: 'string',
    example: 'USA',
    description:
      "The advisor's country of residence as an ISO 3166-1 alpha-3 code (three-letter country code).",
    required: true,
  })
  @IsString()
  @Length(3, 3, { message: 'Your country of residence is required.' })
  @IsNotEmpty()
  countryOfResidence: string;

  @ApiProperty({
    type: 'string',
    example: 'Gre@t Adv1sor Pte Ltd',
    description: 'The legal name of the company where the advisor is employed.',
    required: true,
  })
  @IsString()
  @MinLength(1, { message: 'The name of your business is required.' })
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    type: 'string',
    example: 'Detroit',
    required: true,
    description: `The region of the country where the advisor resides.`,
  })
  @IsString()
  @IsOptional()
  region?: string;
}
