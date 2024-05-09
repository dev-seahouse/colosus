import type { TenantBrandingDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

// TODO: figure out where is the dto?
export interface ConnectAdvisorUpdateContactMeContentRequestDto {
  richText: string;
  contactLink?: null | string;
}

export class ConnectAdvisorContactMeApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/contact-me') {
    super();
  }

  /**
   * Persists Connect contact me reasons (rich text).
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/SetContactMeReasons}.
   */
  public async updateContactMeContent(
    req: ConnectAdvisorUpdateContactMeContentRequestDto
  ) {
    return await this.axios.patch(`${this.apiPath}`, req);
  }
}

export default ConnectAdvisorContactMeApi;
