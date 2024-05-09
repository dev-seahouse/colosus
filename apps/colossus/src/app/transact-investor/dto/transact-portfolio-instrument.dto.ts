import {
  ITransactPortfolioInstrumentDto,
  ITransactPortfolioInstrumentMutableDto,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InstrumentDto } from './i-instruments-search.dto';

export class TransactPortfolioInstrumentMutableDto
  implements ITransactPortfolioInstrumentMutableDto
{
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  instrumentId: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  transactModelPortfolioId: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNumber()
  @IsNotEmpty()
  weightage: number;
}

export class TransactPortfolioInstrumentDto
  extends TransactPortfolioInstrumentMutableDto
  implements ITransactPortfolioInstrumentDto
{
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy?: string;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy?: string;

  @ApiProperty({
    type: InstrumentDto,
  })
  Instrument?: InstrumentDto;
}
