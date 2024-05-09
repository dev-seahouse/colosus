import { IInvestorClientConfigDto } from '@bambu/server-core/configuration';
import {
  PrismaModel,
  SubscriptionStatusEnum,
} from '@bambu/server-core/db/central-db';
import {
  ConnectAdvisorCentralDbRepositoryService,
  ConnectTenantCentralDbRepositoryService,
  TenantCentralDbRepositoryService,
  TenantSubscriptionsCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import { ConnectAdvisorDto } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { IGetProfileInputDto } from './i-get-profile-input.dto';

export abstract class ConnectToolsServiceBase {
  abstract PredictTenantNameFromAdvisorUsername(
    username: string
  ): Promise<string>;

  abstract TenantIdOfSubdomain(subdomain: string): Promise<string>;

  public abstract GetAdvisorProfile({
    userId,
    tenantRealm,
    requestId,
  }: IGetProfileInputDto): Promise<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto>;

  public abstract RemapSubscriptionsForFrontEnd(
    subscriptions: PrismaModel.TenantSubscription[]
  ): ConnectAdvisorDto.IConnectAdvisorProfileInformationSubscriptionDto[];
}

const matchAllAtSymbols = /@/g;
const predictRealmIdFromAdvisorUsernameRegexp = /[^a-zA-Z0-9_-]/g;

interface ICheckIfActiveSubscriptionsAreInPlaceParams {
  requestId: string;
  subscriptions: PrismaModel.TenantSubscription[];
}

/**
 * This service is used to provide functionality specific to Connect that is lightweight and does not fall neatly into any domain.
 */
@Injectable()
export class ConnectToolsService implements ConnectToolsServiceBase {
  constructor(
    private readonly investorClientConfig: ConfigService<IInvestorClientConfigDto>,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly connectAdvisorCentralDb: ConnectAdvisorCentralDbRepositoryService,
    private readonly tenantSubscriptionsCentralDb: TenantSubscriptionsCentralDbRepositoryService,
    private readonly connectTenantCentralDb: ConnectTenantCentralDbRepositoryService
  ) {}

  readonly #logger = new Logger(ConnectToolsService.name);

  async TenantIdOfSubdomain(subdomain: string): Promise<string> {
    const { host } = this.investorClientConfig.get(
      'investorClient'
    ) as IInvestorClientConfigDto['investorClient'];
    const url = `${
      host === 'localhost' ? 'http://' : 'https://'
    }${subdomain}.${host}`;
    const tenant = (await this.tenantCentralDb.findFirst({
      where: {
        httpUrls: {
          some: { url },
        },
      },
    })) as PrismaModel.Tenant;
    return tenant.id;
  }

  async PredictTenantNameFromAdvisorUsername(
    username: string
  ): Promise<string> {
    return username
      .replace(matchAllAtSymbols, '_at_')
      .replace(predictRealmIdFromAdvisorUsernameRegexp, '_')
      .toLowerCase();
  }

  public async GetAdvisorProfile({
    userId,
    tenantRealm,
    requestId,
  }: IGetProfileInputDto): Promise<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetAdvisorProfile.name,
      requestId
    );
    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const isRealmUuid: boolean = UuidUtils.isStringUuid(tenantRealm);
      let targetRealm: string = tenantRealm;
      let tenantId: string = targetRealm;

      if (isRealmUuid) {
        const tenant = await this.tenantCentralDb.FindTenantById(tenantRealm);

        if (!tenant) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`Tenant not found for realm ${tenantRealm}`);
        }

        targetRealm = tenant.realm;
        tenantId = tenant.id;
      } else {
        const tenant = await this.tenantCentralDb.FindTenantByRealm(
          tenantRealm
        );

        if (!tenant) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`Tenant not found for realm ${tenantRealm}`);
        }

        tenantId = tenant.id;
      }

      const [connectAdvisorProfile, connectTenant] = await Promise.all([
        this.connectAdvisorCentralDb.FindFirstAdvisor({
          userId,
          tenantRealm: targetRealm,
        }),
        this.connectTenantCentralDb.GetConnectTenantByTenantId(tenantId),
      ]);

      this.#logger.debug(
        `${logPrefix} Connect Profiles: ${JsonUtils.Stringify({
          connectAdvisorProfile,
          connectTenant,
        })}`
      );

      const platformSetupStatus = connectTenant?.setupState
        ? connectTenant?.setupState
        : null;

      if (!connectAdvisorProfile || !connectAdvisorProfile.Tenant) {
        const returnPayload: ConnectAdvisorDto.IConnectAdvisorProfileInformationDto =
          {
            userId,
            tenantRealm,
            region: null,
            hasActiveSubscription: false,
            subscriptions: [],
            businessName: null,
            firstName: null,
            lastName: null,
            profileBioRichText: null,
            contactMeReasonsRichText: null,
            contactLink: null,
            fullProfileLink: null,
            advisorProfilePictureUrl: null,
            advisorInternalProfilePictureUrl: null,
            countryOfResidence: null,
            jobTitle: null,
            platformSetupStatus,
          };
        const subscriptions = (await this.tenantSubscriptionsCentralDb.findMany(
          {
            where: {
              Tenant: { realm: targetRealm },
            },
          }
        )) as PrismaModel.TenantSubscription[];
        if (subscriptions.length < 1) {
          return returnPayload;
        }
        returnPayload.subscriptions =
          this.RemapSubscriptionsForFrontEnd(subscriptions);

        returnPayload.hasActiveSubscription =
          this.#checkIfActiveSubscriptionsAreInPlace({
            requestId,
            subscriptions,
          });

        return returnPayload;
      }

      const {
        Tenant: { tenantSubscriptions: baseSubscriptions },
        firstName,
        lastName,
        jobTitle,
        countryOfResidence,
        businessName,
        region,
        profileBio,
        contactMeReasons,
        contactLink,
        fullProfileLink,
        advisorProfilePictureUrl,
        advisorInternalProfilePictureUrl,
      } = connectAdvisorProfile;

      const hasActiveSubscription = this.#checkIfActiveSubscriptionsAreInPlace({
        requestId,
        subscriptions: baseSubscriptions,
      });

      return {
        firstName,
        lastName,
        jobTitle,
        countryOfResidence,
        businessName,
        userId,
        tenantRealm,
        region,
        profileBioRichText: profileBio,
        contactMeReasonsRichText: contactMeReasons,
        contactLink,
        fullProfileLink,
        advisorProfilePictureUrl,
        advisorInternalProfilePictureUrl,
        hasActiveSubscription,
        subscriptions: this.RemapSubscriptionsForFrontEnd(baseSubscriptions),
        platformSetupStatus,
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while retrieving advisor profile: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public RemapSubscriptionsForFrontEnd(
    subscriptions: PrismaModel.TenantSubscription[]
  ): ConnectAdvisorDto.IConnectAdvisorProfileInformationSubscriptionDto[] {
    if (!Array.isArray(subscriptions) || subscriptions.length < 1) {
      return [];
    }

    this.#logger.debug(
      `Remapping subscriptions based on: ${JsonUtils.Stringify(subscriptions)}`
    );

    const remappedValues = _.chain(subscriptions)
      .cloneDeep()
      .map(
        (x) =>
          ({
            subscriptionId: x.providerSubscriptionId,
            productCode: x.bambuGoProductId,
            productId: x.subscriptionProviderProductId,
            bambuGoProductId: x.bambuGoProductId,
            isInterestedInTransact: x.isInterestedInTransact,
          } as ConnectAdvisorDto.IConnectAdvisorProfileInformationSubscriptionDto)
      )
      .value();

    this.#logger.debug(
      `Remapped subscriptions: ${JsonUtils.Stringify(remappedValues)}`
    );

    return remappedValues;
  }

  #checkIfActiveSubscriptionsAreInPlace({
    requestId,
    subscriptions,
  }: ICheckIfActiveSubscriptionsAreInPlaceParams) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#checkIfActiveSubscriptionsAreInPlace.name,
      requestId
    );

    this.#logger.debug(
      [
        `${logPrefix} Checking if active subscriptions are in place.`,
        `Input: ${JsonUtils.Stringify(subscriptions)}.`,
      ].join(' ')
    );

    try {
      const activeSubscriptionIndex = subscriptions.findIndex((x) => {
        const { providerSubscriptionId, status } = x;

        if (
          providerSubscriptionId === undefined ||
          providerSubscriptionId === null ||
          typeof providerSubscriptionId !== 'string' ||
          providerSubscriptionId.trim().length < 1
        ) {
          return false;
        }

        return status === SubscriptionStatusEnum.ACTIVE;
      });

      return activeSubscriptionIndex > -1;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify(
          error
        )}. Input: ${JsonUtils.Stringify(subscriptions)}.`
      );

      throw error;
    }
  }
}
