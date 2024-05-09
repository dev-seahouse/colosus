import {
  IInstrumentAssetClassDto,
  IInstrumentCurrencyDto,
  IInstrumentDto,
  IInstrumentExchangeDto,
  IInstrumentFactSheetDto,
  IInstrumentsSearchResponseDto,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class InstrumentAssetClassDto implements IInstrumentAssetClassDto {
  // Instruments: IInstrumentDto[];

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
}

export class InstrumentExchangeDto implements IInstrumentExchangeDto {
  // Instrument: IInstrumentDto[];

  @ApiProperty({
    type: 'string',
  })
  bambuExchangeCode: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
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
  updatedBy: string;
}

export class InstrumentCurrencyDto implements IInstrumentCurrencyDto {
  // Instrument: IInstrumentDto[];

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  iso4217Code: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
}

export class InstrumentFactSheetDto implements IInstrumentFactSheetDto {
  // Instrument: IInstrumentDto;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  instrumentId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uri',
  })
  url: string;
}

export class InstrumentDto implements IInstrumentDto {
  @ApiProperty({
    type: InstrumentAssetClassDto,
  })
  InstrumentAssetClass?: InstrumentAssetClassDto;

  @ApiProperty({
    type: InstrumentCurrencyDto,
  })
  InstrumentCurrency?: IInstrumentCurrencyDto;

  @ApiProperty({
    type: InstrumentExchangeDto,
  })
  InstrumentExchange?: InstrumentExchangeDto;

  @ApiProperty({
    type: InstrumentFactSheetDto,
    isArray: true,
  })
  InstrumentFactSheet?: InstrumentFactSheetDto[];

  @ApiProperty({
    type: 'string',
    nullable: true,
    default: null,
  })
  bloombergTicker?: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    default: null,
  })
  cusip?: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  instrumentAssetClassId: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  instrumentCurrencyId: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  instrumentExchangeId: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    default: null,
  })
  isin?: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    default: null,
  })
  ricSymbol?: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
}

export class InstrumentsSearchResponseDto
  implements IInstrumentsSearchResponseDto
{
  @ApiProperty({
    type: InstrumentDto,
    isArray: true,
  })
  data: InstrumentDto[];

  @ApiProperty({
    type: 'number',
  })
  filteredCount: number;

  @ApiProperty({
    type: 'number',
  })
  allTotalCount: number;

  @ApiProperty({
    type: 'number',
  })
  pageCount: number;
}
