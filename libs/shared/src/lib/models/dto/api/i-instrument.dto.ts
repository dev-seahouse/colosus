export interface IInstrumentAssetClassDto {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt: Date | string;
  Instruments?: IInstrumentDto[];
}

export interface IInstrumentExchangeDto {
  id: string;
  bambuExchangeCode: string;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt: Date | string;
  Instrument?: IInstrumentDto[];
}

export interface IInstrumentCurrencyDto {
  id: string;
  iso4217Code: string;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt: Date | string;
  Instrument?: IInstrumentDto[];
}

export interface IInstrumentDto {
  id: string;
  bloombergTicker?: string | null;
  ricSymbol?: string | null;
  isin?: string | null;
  cusip?: string | null;
  name: string;
  instrumentAssetClassId: string;
  instrumentExchangeId: string;
  instrumentCurrencyId: string;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt: Date | string;
  InstrumentFactSheet?: IInstrumentFactSheetDto[];
  InstrumentAssetClass?: IInstrumentAssetClassDto;
  InstrumentExchange?: IInstrumentExchangeDto;
  InstrumentCurrency?: IInstrumentCurrencyDto;
}

export interface IInstrumentFactSheetDto {
  id: string;
  url: string;
  instrumentId: string;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt: Date | string;
  Instrument?: IInstrumentDto;
}

export interface IInstrumentsSearchResponseDto {
  data: IInstrumentDto[];
  pageCount: number;
  filteredCount: number;
  allTotalCount: number;
}
