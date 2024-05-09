import type {
  IInstrumentAssetClassDto,
  IInstrumentsSearchResponseDto,
} from '@bambu/shared';
import TransactInvestorBaseApi from '../_Base/Base';

export type InvestorGetInstrumentsRequestDto = {
  pageIndex: number;
  pageSize: number;
  searchString?: string | undefined;
};

export type InvestorGetInstrumentsResponseDto = IInstrumentsSearchResponseDto;
export type InvestorGetInstrumentAssetClassesResponseDto =
  IInstrumentAssetClassDto;

export class TransactInvestorInstrumentsApi extends TransactInvestorBaseApi {
  constructor(private readonly apiPath = '/instruments') {
    super();
  }

  public async getInstruments(args: InvestorGetInstrumentsRequestDto) {
    const { pageIndex, pageSize, searchString } = args;

    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchString !== undefined) {
      params.append('searchString', searchString);
    }
    const queryString = params.toString();

    return this.axios.get<InvestorGetInstrumentsResponseDto>(
      `${this.apiPath}?${queryString}`
    );
  }

  public getInstrumentAssetClasses() {
    return this.axios.get<InvestorGetInstrumentAssetClassesResponseDto>(
      this.apiPath + '/asset-classes'
    );
  }
}

export default TransactInvestorInstrumentsApi;
