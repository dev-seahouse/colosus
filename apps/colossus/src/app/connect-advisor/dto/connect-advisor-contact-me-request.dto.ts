import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConnectAdvisorContactMeRequestDto {
  @ApiProperty({
    type: 'string',
    example: '<p>Hello <strong>World</strong></p>',
    description:
      'Sanitized HTML for use in TipTap or other WYSIWYG editor describing reasons to contact the advisor.',
  })
  @IsString()
  @IsOptional()
  richText?: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'uri',
    example: 'https://www.bambu.life',
    description: 'Link to the contact page of the tenant.',
    default: null,
  })
  @IsString()
  @IsOptional()
  contactLink?: string | null = null;
}
