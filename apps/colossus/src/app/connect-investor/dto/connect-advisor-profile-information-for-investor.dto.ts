import { IGetAdvisorProfileResponseDto } from '@bambu/server-connect/domains';
import { SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ConnectAdvisorProfileInformationForInvestorDto
  implements
    Pick<
      IGetAdvisorProfileResponseDto,
      | 'firstName'
      | 'lastName'
      | 'tenantRealm'
      | 'profileBioRichText'
      | 'contactMeReasonsRichText'
      | 'jobTitle'
      | 'contactLink'
      | 'fullProfileLink'
      | 'advisorProfilePictureUrl'
      | 'incomeThreshold'
      | 'retireeSavingsThreshold'
      | 'advisorSubscriptionInPlace'
      | 'advisorSubscriptionIds'
    >
{
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
    example: '<p>Example <strong>Text</strong></p>',
    required: false,
    description: `Sanitized HTML for use in TipTap or other WYSIWYG editor describing the advisor's bio.`,
  })
  profileBioRichText: string | null;

  @ApiProperty({
    type: 'string',
    example: '<p>Example <strong>Text</strong></p>',
    required: false,
    description: `Sanitized HTML for use in TipTap or other WYSIWYG editor describing reasons to contact the advisor.`,
  })
  contactMeReasonsRichText: string | null;

  @ApiProperty({
    type: 'string',
    example: 'Senior Financial Advisor',
    description: 'The job title of the advisor.',
    required: true,
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Whether the advisor has an active subscription.',
    required: true,
  })
  @IsBoolean()
  advisorSubscriptionInPlace: boolean;

  @ApiProperty({
    type: 'string',
    format: 'uri',
    example: 'https://www.bambu.life',
    description: 'Link to the contact page of the tenant.',
  })
  @IsString()
  @IsOptional()
  contactLink: string | null = null;

  @ApiProperty({
    type: 'string',
    example: 'https://me.external.com/profile',
    description: `A URL to the advisor's profile on an external website.`,
  })
  @IsString()
  @IsOptional()
  fullProfileLink: string | null;

  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    required: false,
    description: `A URL to an image file displaying the advisor's portrait.`,
  })
  advisorProfilePictureUrl: string | null;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 100000,
    description: 'Income threshold for investor still in the workforce.',
    required: true,
  })
  @IsOptional()
  @IsInt()
  incomeThreshold: number;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 100000,
    description: 'Savings threshold for a retired investor.',
  })
  @IsOptional()
  @IsInt()
  retireeSavingsThreshold: number;

  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
    enum: SharedEnums.BambuGoProductIdEnum,
    example: [SharedEnums.BambuGoProductIdEnum.CONNECT],
    description: 'The advisor subscription ids.',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SharedEnums.BambuGoProductIdEnum, { each: true })
  advisorSubscriptionIds: SharedEnums.BambuGoProductIdEnum[] | null = null;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Whether the advisor can perform transact actions.',
    required: true,
  })
  @IsBoolean()
  canPerformTransactActions: boolean = false;
}
