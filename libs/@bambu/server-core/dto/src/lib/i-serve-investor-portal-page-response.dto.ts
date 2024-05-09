export interface IServeInvestorPortalPageResponseDto {
  isValid: boolean;
  isRedirect: boolean;
  redirectUrl: string | null;
  contentBody: Buffer | null;
  httpStatusCode: number;
  contentTypeHeader: string;
  etagHeader: string | null;
}
