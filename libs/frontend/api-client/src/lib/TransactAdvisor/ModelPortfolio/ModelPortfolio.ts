import TransactAdvisorBaseApi from '../_Base/Base';
import type {
  IGetModelPortfolioByIdResponseDto,
  ITransactPortfolioInstrumentDto,
} from '@bambu/shared';
import { ITransactPortfolioInstrumentMutableDto } from '@bambu/shared';

export interface TransactModelPortfolioSummaryDto {
  connectPortfolioSummaryId: string;
  createdAt: string;
  createdBy: string;
  description: string;
  expectedAnnualReturn: number;
  expectedAnnualVolatility: number;
  factSheetUrl: string;
  id: string;
  name: string;
  rebalancingThreshold: number;
  updatedAt: string;
  updatedBy: string;
}

export type GetModelPortfolioResponseDto = IGetModelPortfolioByIdResponseDto;

export interface TransactModePortfolioFileUploadDto {
  id: string;
  file: FormData;
}

export type TransactCreateModelPortfolioInstrumentsDto =
  ITransactPortfolioInstrumentMutableDto;

export type TransactCreateModePortfolioInstrumentsResponseDto =
  ITransactPortfolioInstrumentDto[];

export class TransactAdvisorModelPortfolioApi extends TransactAdvisorBaseApi {
  constructor(private readonly apiPath = '/model-portfolio') {
    super();
  }

  /**
   * Get model portfolios for tenant
   * - {@link http://localhost:9000/openapi#/Transact%20Advisor/TransactAdvisorController_GetModelPortfoliosForTenant}.
   */
  public async getModelPortfolios() {
    return this.axios.get<GetModelPortfolioResponseDto[]>(`${this.apiPath}`);
  }

  public async getModelPortfolioById(id: string) {
    const encodedId = encodeURIComponent(id);
    return this.axios.get<GetModelPortfolioResponseDto>(
      `${this.apiPath}/${encodedId}`
    );
  }

  /**
   * Create model portoflio
   * - {@link http://localhost:9000/openapi#/Transact%20Advisor/TransactAdvisorController_CreateModelPortfolio}.
   */
  public async createModelPortfolio(args: TransactModelPortfolioSummaryDto) {
    return this.axios.post<TransactModelPortfolioSummaryDto>(
      `${this.apiPath}`,
      args
    );
  }

  /**
   * Upload model portfolio fact sheet pdf document
   * - {@link   http://localhost:9000/openapi#/Transact%20Advisor/TransactAdvisorController_UploadModelPortfolioFactSheet}.
   */

  public async uploadModelPortfolioFactSheet({
    id,
    file,
  }: TransactModePortfolioFileUploadDto) {
    const encodedId = encodeURIComponent(id);
    return this.axios.post(`${this.apiPath}/${encodedId}/fact-sheet`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get model portfolio instruments for tenant by id
   * - {@link http://localhost:9000/openapi#/Transact%20Advisor/TransactAdvisorController_UpsertTransactModelPortfolioInstrument}.
   */

  public async upsertModelPortfolioInstruments(
    req: TransactCreateModelPortfolioInstrumentsDto[]
  ) {
    const instrumentData = req.find((req) => req.transactModelPortfolioId);
    const id = instrumentData?.transactModelPortfolioId;
    return this.axios.post(`${this.apiPath}/${id}/instruments`, req);
  }
}

export default TransactAdvisorModelPortfolioApi;
