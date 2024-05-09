export interface IModelPortfolioDetailsForWKEmailDto {
  id: string;
  name: string;
  description: string;
}

export interface IModelPortfolioDetaislForWKEmailDto {
  id: string;
  isin: string;
  weightage: number;
}

export interface IGenerateMJMLTemplateForUpdatePortfolioDataWKParams {
  modelPortfolioDetails: IModelPortfolioDetailsForWKEmailDto;
  tenantEmail: string;
  payload: IModelPortfolioDetaislForWKEmailDto[];
}
