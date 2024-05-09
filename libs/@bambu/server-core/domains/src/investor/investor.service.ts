// noinspection ES6PreferShortImport

import {
  FusionAuthIamGroupRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  IGetInvestorLeadsPagedResponseDataDto,
  InvestorCentralDbRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import { JsonUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import {
  IConvertLeadToPlatformUserParams,
  IGetLeadInvestorByTenantIdAndEmailParams,
  InvestorServiceBase,
} from './investor.service.base';

@Injectable()
export class InvestorService implements InvestorServiceBase {
  readonly #logger: Logger = new Logger(InvestorService.name);

  constructor(
    private readonly fusionAuthUser: FusionAuthIamUserRepositoryServiceBase,
    private readonly fusionAuthGroup: FusionAuthIamGroupRepositoryServiceBase,
    private readonly investorRepository: InvestorCentralDbRepositoryServiceBase
  ) {}

  async GetLeadInvestorByTenantIdAndEmail(
    params: IGetLeadInvestorByTenantIdAndEmailParams
  ): Promise<IGetInvestorLeadsPagedResponseDataDto> {
    const logPrefix = `${this.ConvertLeadToPlatformUser.name} -`;

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(params)}`
    );

    const { tracking, tenantId, email } = params;
    try {
      const investorRes =
        await this.investorRepository.GetInvestorLeadByTenantIdAndEmail(
          tracking.requestId,
          tenantId,
          email
        );
      this.#logger.debug(`${logPrefix} Found investor: ${investorRes}.`);
      return investorRes;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${error}`);
      throw error;
    }
  }

  async ConvertLeadToPlatformUser(params: IConvertLeadToPlatformUserParams) {
    const logPrefix = `${this.ConvertLeadToPlatformUser.name} -`;

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(params)}`
    );

    const { tracking, tenantId, applicationId, leadId, password } = params;

    this.#logger.debug(
      `${logPrefix} Converting lead ${leadId} to platform user`
    );
    try {
      const investorRes = await this.investorRepository.GetInvestorLeadById(
        tracking.requestId,
        leadId
      );
      if (!investorRes) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'Investor of lead type and given tenantId and email not found in DB table'
        );
      }
      this.#logger.debug(`${logPrefix} Found investor: ${investorRes}`);
      this.#logger.log(`${logPrefix} Retrieving investor group for tenant`);

      const groups =
        await this.fusionAuthGroup.AdministrativelyGetGroupsForTenantByApplicationIdAndRoleName(
          {
            tracking,
            tenantId,
            applicationId,
            roleName: 'Investor',
          }
        );
      if (!groups || groups.length !== 1) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'Unique investor group not found in FusionAuth for given tenant and application'
        );
      }
      const groupMemberships = groups.map(({ id }) => id);
      this.#logger.log(
        `${logPrefix} Creating IAM user for investor ${investorRes.id}`
      );

      // TODO: verify PII to migrate to IAM
      const faRes =
        await this.fusionAuthUser.CreateUserAndRegisterToApplication(
          tracking.requestId,
          {
            tenantId,
            applicationPreferredLanguages: ['en'],
            applicationId,
            user: {
              groupMemberships,
              additionalMetadata: {
                // This should contain the data that was in the lead, including PII
                leadData: investorRes,
              },
              username: investorRes.email,
              password,
              mobilePhone: investorRes.phoneNumber,
              userId: investorRes.id,
              email: investorRes.email,
            },
          }
        );

      this.#logger.debug(
        `${logPrefix} Created IAM user for investor ${
          investorRes.id
        }; response: ${JsonUtils.Stringify(faRes)}`
      );

      this.#logger.debug(
        `${logPrefix} Wiping PII in DB of investor ${investorRes.id}`
      );
      await this.investorRepository.UpdateLeadInvestorTypeAndWipePii({
        tracking,
        tenantId,
        id: investorRes.id,
      });
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${error}`);
      throw error;
    }
  }
}
