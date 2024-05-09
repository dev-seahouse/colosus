import { ITransactPortfolioHoldingsDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { TransactPortfolioInstrumentDto } from './transact-portfolio-instrument.dto';

export class TransactPortfolioHoldingsDto
  extends TransactPortfolioInstrumentDto
  implements ITransactPortfolioHoldingsDto
{
  @ApiProperty({
    type: 'number',
    description: 'The number of units held.',
    format: 'double',
  })
  units: number;

  @ApiProperty({
    type: 'number',
    description: 'The price of the units held.',
    format: 'double',
  })
  price: number;

  @ApiProperty({
    type: 'string',
    description: 'The currency of the units held.',
  })
  currency: string | null = null;

  @ApiProperty({
    type: 'number',
    description: 'The current value of the units held.',
    format: 'double',
  })
  currentValue: number;

  @ApiProperty({
    type: 'string',
    description: 'The date of this valuation.',
    format: 'date',
  })
  valuationDate: string;
}
