import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationListAllQueryParamsBaseDto } from './brokerage-integration-list-all-query-params-base.dto';
import { IBrokerageIntegrationListAllPartiesQueryParamsDto } from './i-brokerage-integration-party.dto';

export class BrokerageIntegrationListAllPartiesQueryParamsDto
  extends BrokerageIntegrationListAllQueryParamsBaseDto
  implements IBrokerageIntegrationListAllPartiesQueryParamsDto
{
  @ApiProperty({
    required: false,
    description: 'Filter by client reference number.',
  })
  @IsOptional()
  @IsString()
  clientReference?: string;

  @ApiProperty({ required: false, description: 'Filter by email address.' })
  @IsOptional()
  @IsString()
  emailAddress?: string;

  @ApiProperty({ required: false, description: 'Filter by name.' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Filter by organization type.' })
  @IsOptional()
  @IsString()
  organizationType?: string;

  @ApiProperty({ required: false, description: 'Filter by party type.' })
  @IsOptional()
  @IsString()
  partyType?: string;

  @ApiProperty({ required: false, description: 'Filter by surname.' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ required: true, description: 'The tenant id.' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
