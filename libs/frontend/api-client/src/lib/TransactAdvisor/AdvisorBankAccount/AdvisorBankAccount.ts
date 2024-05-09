import TransactAdvisorBaseApi from '../_Base/Base';
import type {
  ITransactAdvisorBankAccountDto,
  ITransactAdvisorBankAccountMutableForApiDto,
} from '@bambu/shared';

export type AdvisorBankAccountDto = ITransactAdvisorBankAccountMutableForApiDto;

export type GetAdvisorBankAccountResponseDto = ITransactAdvisorBankAccountDto;

export class TransactAdvisorBankAccountApi extends TransactAdvisorBaseApi {
  constructor(private readonly apiPath = '/advisor-bank-account') {
    super();
  }

  public async saveAdvisorBankAccount(req: AdvisorBankAccountDto) {
    return this.axios.post(this.apiPath, req);
  }

  public async updateAdvisorBankAccount(req: AdvisorBankAccountDto) {
    return this.axios.patch(this.apiPath, req);
  }

  public async getAdvisorBankAccount() {
    return this.axios.get<GetAdvisorBankAccountResponseDto>(this.apiPath);
  }
}

export default TransactAdvisorBankAccountApi;
