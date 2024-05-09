import { IBrokerageIntegrationMoneyDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BrokerageIntegrationMoneyDto
  implements IBrokerageIntegrationMoneyDto
{
  @ApiProperty({
    example: 'GBP',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[A-Z]{3}$/, {
    message:
      'Currency must be a valid ISO 4217 code consisting of exactly 3 uppercase letters',
  })
  currency: string;

  @ApiProperty({ example: 1.14 })
  @IsNumber()
  amount: number;
}
