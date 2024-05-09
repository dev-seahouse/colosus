export interface IGetInvestorUiProxyConfigResponseSeoDataDto {
  image: string | null;
  title: string | null;
  description: string | null;
}

export interface IGetInvestorUiProxyConfigResponseDto {
  isValid: boolean;
  seoData: IGetInvestorUiProxyConfigResponseSeoDataDto;
}
