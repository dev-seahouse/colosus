import ConnectAdvisorBasePrivateApi from '../_Base/Base';

// TODO: figure out where is the dto?
export interface ConnectAdvisorUpdateProfileSummaryContentRequestDto {
  richText: string;
  fullProfileLink: string;
}

export class ConnectAdvisorProfileBioApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/profile-bio') {
    super();
  }

  /**
   * Persists Connect profile summary (rich text).
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/SetProfileBio}.
   */
  public async updateProfileSummaryContent(
    req: ConnectAdvisorUpdateProfileSummaryContentRequestDto
  ) {
    return await this.axios.patch(`${this.apiPath}`, req);
  }
}

export default ConnectAdvisorProfileBioApi;
