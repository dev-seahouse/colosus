import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, ValidateIf } from 'class-validator';

export class ConnectAdvisorProfileBioInputDto {
  @ApiProperty({
    type: 'string',
    example: '<p>Hello <strong>World</strong></p>',
    description: 'A string containing HTML for use in WYSIWYG editors.',
    required: true,
  })
  @IsString()
  richText: string;

  @ApiProperty({
    type: 'string',
    example: 'http://my-website.com/my-profile',
    description: "A link containing advisor's website, or an empty string",
    required: true,
  })
  @IsString()
  @ValidateIf((o) => o.fullProfileLink !== '')
  @IsUrl()
  fullProfileLink: string;
}
