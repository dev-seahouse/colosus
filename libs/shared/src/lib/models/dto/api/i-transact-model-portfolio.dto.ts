import {
  IInstrumentAssetClassDto,
  IInstrumentCurrencyDto,
  IInstrumentDto,
  IInstrumentExchangeDto,
  IInstrumentFactSheetDto,
} from './i-instrument.dto';

export interface ITransactModelPortfolioDto {
  id: string;
  name?: string | null;
  description?: string | null;
  expectedAnnualReturn?: number | null;
  expectedAnnualVolatility?: number | null;
  rebalancingThreshold?: number | null;
  factSheetUrl?: string | null;
  partnerModelId?: string | null;
  connectPortfolioSummaryId: string;
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
  // ConnectPortfolioSummary: IConnectPortfolioSummaryDto;
  // TransactPortfolioInstruments: ITransactPortfolioInstrumentsDto[];
}

export interface ITransactPortfolioInstrumentMutableDto {
  weightage: number;
  instrumentId: string;
  transactModelPortfolioId: string;
}

export interface ITransactPortfolioInstrumentDto
  extends ITransactPortfolioInstrumentMutableDto {
  id: string;
  createdBy?: string;
  createdAt: Date | string;
  updatedBy?: string;
  updatedAt: Date | string;
  // Instrument: IInstrumentsDto;
  // TransactModelPortfolio: ITransactModelPortfolioDto;
}

export interface ITransactPortfolioInstrumentWithInstrumentDto
  extends ITransactPortfolioInstrumentDto {
  Instrument?: IInstrumentDto & {
    InstrumentFactSheets?: IInstrumentFactSheetDto[];
    InstrumentExchange?: IInstrumentExchangeDto;
    InstrumentCurrency?: IInstrumentCurrencyDto;
    InstrumentAssetClass?: IInstrumentAssetClassDto;
  };
}

export interface IGetModelPortfolioByIdResponseDto
  extends ITransactModelPortfolioDto {
  TransactModelPortfolioInstruments?: ITransactPortfolioInstrumentWithInstrumentDto[];
  // TransactModelPortfolioInstruments?: Array<
  //   ITransactPortfolioInstrumentDto & {
  //     Instrument?: IInstrumentDto & {
  //       InstrumentFactSheets?: IInstrumentFactSheetDto[];
  //       InstrumentExchange?: IInstrumentExchangeDto;
  //       InstrumentCurrency?: IInstrumentCurrencyDto;
  //       InstrumentAssetClass?: IInstrumentAssetClassDto;
  //     };
  //   }
  // >;
}

export interface ITransactPortfolioHoldingsDto
  extends ITransactPortfolioInstrumentWithInstrumentDto {
  units: number;
  price: number;
  currency: string | null;
  currentValue: number;
  valuationDate: string;
}

export interface ITransactPortfolioConfigForWKEmailDto {
  instrumentId: string;
  weightage: number;
  isin: string;
  modelportfolioId: string;
}
