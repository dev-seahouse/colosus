import TransactAdvisorBaseApi from '../_Base/Base';
import type {
  // IInstrumentAssetClassDto,
  IInstrumentDto,
  IInstrumentsSearchResponseDto,
} from '@bambu/shared';

export type AdvisorGetInstrumentsRequestDto = {
  pageIndex: number;
  pageSize: number;
  searchString?: string | undefined;
};

export type AdvisorGetInstrumentsResponseDto = IInstrumentsSearchResponseDto;
export type AdvisorInstrumentsDto = IInstrumentDto;
// export type InvestorGetInstrumentAssetClassesResponseDto =
//   IInstrumentAssetClassDto;

export class TransactAdvisorInstrumentsApi extends TransactAdvisorBaseApi {
  constructor(private readonly apiPath = '/instruments') {
    super();
  }
  public async getInstruments(args: AdvisorGetInstrumentsRequestDto) {
    const { pageIndex, pageSize, searchString } = args;

    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchString !== undefined) {
      params.append('searchString', searchString);
    }
    const queryString = params.toString();

    return this.axios.get<AdvisorGetInstrumentsResponseDto>(
      `${this.apiPath}?${queryString}`
    );
  }
}

export default TransactAdvisorInstrumentsApi;
