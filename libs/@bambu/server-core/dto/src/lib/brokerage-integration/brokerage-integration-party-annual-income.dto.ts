import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';
import { IBrokerageIntegrationPartyAnnualIncomeDto } from './i-brokerage-integration-party.dto';

export class BrokerageIntegrationPartyAnnualIncomeDto
  implements IBrokerageIntegrationPartyAnnualIncomeDto
{
  @ApiProperty({ description: 'Amount of the annual income.' })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Currency of the annual income.' })
  @IsString()
  @MinLength(1)
  currency: string;
}
