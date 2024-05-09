import type { ConnectAdvisorDto } from '@bambu/shared';

import ConnectAdvisorBasePrivateApi from '../_Base/Base';

// TODO: update this, doing this cause BE does not type everything in the dto
export interface ConnectAdvisorGetProfileResponseDto
  extends Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> {
  username: string;
  emailVerified: boolean;
  subdomain: string | null;
  advisorSubscriptionIds: 'CONNECT' | 'TRANSACT' | null;
}

export type ConnectAdvisorUpdateProfileRequestDto = Omit<
  ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
  | 'userId'
  | 'tenantRealm'
  | 'hasActiveSubscription'
  | 'subscriptions'
  | 'fullProfileLink'
>;

// 204 returns an empty string
export type ConnectAdvisorUpdateProfileResponseDto = string;

export class ConnectAdvisorProfileApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/profile') {
    super();
  }

  /**
   * Retrieves some user information associated with the advisor.
   * - {@link http://localhost:9000/openapi#/Connect/GetProfile}.
   */
  public async getProfile() {
    return await this.axios.get<ConnectAdvisorGetProfileResponseDto>(
      `${this.apiPath}`
    );
  }

  /**
   * Persists some account and personal information about the advisor on the platform.
   * - ${@link http://localhost:9000/openapi#/Connect/UpdateProfile}
   */
  public async updateProfile(req: ConnectAdvisorUpdateProfileRequestDto) {
    return await this.axios.patch<ConnectAdvisorUpdateProfileResponseDto>(
      `${this.apiPath}`,
      req
    );
  }

  /**
   * Set a profile picture for the advisor that is presented to investors.
   * - ${@link http://localhost:9000/openapi#/Connect%20Advisor/SetProfilePicture}
   */
  public async uploadAdvisorPublicProfilePicture(req: FormData) {
    return this.axios.post(`${this.apiPath}/picture/public`, req, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Set a profile picture for the advisor's internal use on the platform.
   * - ${@link http://localhost:9000/openapi#/Connect%20Advisor/SetInternalProfilePicture}
   */
  public async uploadAdvisorInternalProfilePicture(req: FormData) {
    return this.axios.post(`${this.apiPath}/picture/internal`, req, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Unset the profile picture for the advisor that is presented to investors.
   * - ${@link http://localhost:9000/openapi#/Connect%20Advisor/UnsetProfilePicture}
   */
  public async deleteAdvisorPublicProfilePicture() {
    return this.axios.delete(`${this.apiPath}/picture/public`);
  }

  /**
   * Unset the profile picture for the advisor's internal use on the platform.
   * - ${@link http://localhost:9000/openapi#/Connect%20Advisor/UnsetInternalProfilePicture}
   */
  public async deleteAdvisorInternalProfilePicture() {
    return this.axios.delete(`${this.apiPath}/picture/internal`);
  }
}

export default ConnectAdvisorProfileApi;
