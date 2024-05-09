import { IGetModelPortfolioByIdResponseDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { TransactModelPortfolioDto } from './transact-model-portfolio.dto';
import { TransactPortfolioInstrumentDto } from './transact-portfolio-instrument.dto';

export class GetModelPortfolioByIdResponseDto
  extends TransactModelPortfolioDto
  implements IGetModelPortfolioByIdResponseDto
{
  @ApiProperty({
    type: TransactPortfolioInstrumentDto,
    isArray: true,
  })
  TransactModelPortfolioInstruments?: Array<TransactPortfolioInstrumentDto>;
}
