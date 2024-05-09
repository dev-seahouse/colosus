import { StripeIntegrationDto } from '@bambu/shared';

export interface IListProductsDomainRequestDto {
  requestId: string;
  parameters: StripeIntegrationDto.IStripeListProductsRequestDto;
}
