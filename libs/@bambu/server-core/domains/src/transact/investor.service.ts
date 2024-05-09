// noinspection ES6PreferShortImport

import { PrismaModel } from '@bambu/server-core/db/central-db';
import {
  BrokerageIntegrationServerDto,
  IColossusTrackingDto,
  InvestorKycDto,
} from '@bambu/server-core/dto';
import {
  ConnectTenantGoalTypeCentralDbRepositoryService,
  FusionAuthIamApplicationRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  GoalCentralDbRepositoryServiceBase,
  InstrumentsCentralDbRepositoryServiceBase,
  InvestorCentralDbRepositoryServiceBase,
  TransactModelPortfolioCentralDbRepositoryServiceBase,
  WealthKernelConnectorDirectDebitApiRepositoryServiceBase,
  WealthKernelConnectorPartiesApiRepositoryServiceBase,
  WealthKernelConnectorPerformanceApiRepositoryServiceBase,
  WealthKernelConnectorPortfoliosApiRepositoryServiceBase,
  WealthKernelConnectorTransactionsApiRepositoryServiceBase,
  WealthKernelConnectorValuationsApiRepositoryServiceBase,
  WealthKernelConnectorWithdrawalsApiRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  AuthenticationDto,
  IBrokerageIntegrationListAllWithdrawalsQueryParamsDto,
  IBrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  IBrokerageIntegrationWithdrawalDto,
  IBrokerageIntegrationWithdrawalMutableDto,
  IColossusListAllWithdrawalsQueryParamsDto,
  IColossusUserOtpRequestDto,
  IColossusWithdrawalMutableDto,
  IGetModelPortfolioByIdResponseDto,
  IInstrumentAssetClassDto,
  IInstrumentsSearchResponseDto,
  IInvestorPlatformProfileDto,
  IInvestorPlatformProfileGoalDto,
  IInvestorPlatformUserAccountDto,
  ITransactPortfolioHoldingsDto,
  OtpDto,
  SharedEnums,
} from '@bambu/shared';
import { User } from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as Luxon from 'luxon';
import { AuthenticationServiceBase } from '../auth';
import { InvestorServiceBase } from '../investor';
import { OtpServiceBase } from '../otp';
import {
  IConvertLeadToPlatformUserByOriginAndEmailParams,
  ILoginParams,
  IResendVerificationOtpParamsDto,
  TransactInvestorServiceBase,
} from './investor.service.base';

@Injectable()
export class TransactInvestorService implements TransactInvestorServiceBase {
  readonly #logger: Logger = new Logger(TransactInvestorService.name);

  constructor(
    private readonly investorService: InvestorServiceBase,
    private readonly authenticationService: AuthenticationServiceBase,
    private readonly connectTenantGoalTypeCentralDb: ConnectTenantGoalTypeCentralDbRepositoryService,
    private readonly fusionAuthApplication: FusionAuthIamApplicationRepositoryServiceBase,
    private readonly investorCentralDb: InvestorCentralDbRepositoryServiceBase,
    private readonly otpService: OtpServiceBase,
    private readonly fusionAuthUser: FusionAuthIamUserRepositoryServiceBase,
    private readonly wealthKernelConnectorPartiesApi: WealthKernelConnectorPartiesApiRepositoryServiceBase,
    private readonly instrumentsCentralDb: InstrumentsCentralDbRepositoryServiceBase,
    private readonly wealthKernelConnectorDirectDebitApi: WealthKernelConnectorDirectDebitApiRepositoryServiceBase,
    private readonly transactModelPortfolioCentralDb: TransactModelPortfolioCentralDbRepositoryServiceBase,
    private readonly wealthKernelConnectorPortfoliosApi: WealthKernelConnectorPortfoliosApiRepositoryServiceBase,
    private readonly wealthKernelConnectorValuationsApi: WealthKernelConnectorValuationsApiRepositoryServiceBase,
    private readonly goalCentralDb: GoalCentralDbRepositoryServiceBase,
    private readonly wealthKernelConnectorTransactionsApi: WealthKernelConnectorTransactionsApiRepositoryServiceBase,
    private readonly wealthKernelConnectorPerformanceApi: WealthKernelConnectorPerformanceApiRepositoryServiceBase,
    private readonly wealthKernelConnectorWithdrawalsApi: WealthKernelConnectorWithdrawalsApiRepositoryServiceBase
  ) {}

  async ConvertLeadToPlatformUserByOriginAndEmail(
    params: IConvertLeadToPlatformUserByOriginAndEmailParams
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ConvertLeadToPlatformUserByOriginAndEmail.name,
      params.tracking.requestId
    );

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(params)}.`
    );

    const { tracking, origin, ...forwardedParams } = params;

    if (!origin) {
      throw this.generateMissingOriginError(tracking.requestId);
    }

    try {
      const { id: tenantId } = await this.GetTenantFromOriginUrl(
        tracking.requestId,
        origin
      );
      const applicationId = await this.getTransactApplicationId(
        tracking,
        tenantId
      );
      const leadRes =
        await this.investorService.GetLeadInvestorByTenantIdAndEmail({
          tracking,
          tenantId,
          ...forwardedParams,
        });
      await this.investorService.ConvertLeadToPlatformUser({
        tracking,
        leadId: leadRes.id,
        email: leadRes.email,
        password: forwardedParams.password,
        tenantId,
        applicationId,
        applicationPreferredLanguages: ['en'],
      });
      await this.investorCentralDb.UpsertInvestorPlatformUser(
        tracking.requestId,
        {
          applicationId,
          data: null,
          investorId: leadRes.id,
        }
      );
      await this.sendInvestorPlatformOtp(
        tracking,
        tenantId,
        leadRes.email,
        leadRes.id,
        OtpDto.EnumOtpMode.EMAIL
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${error}.`);
      throw error;
    }
  }

  private async sendInvestorPlatformOtp(
    tracking: IColossusTrackingDto,
    tenantId: string,
    email: string,
    investorPlatformUserId: string,
    mode: OtpDto.EnumOtpMode
  ): Promise<void> {
    await this.otpService.SendInvestorPlatformOtp(tracking, {
      tenantId,
      email,
      purpose: 'INVESTOR_EMAIL_VERIFICATION',
      mode,
      investorPlatformUserId,
    });
  }

  async Login(
    params: ILoginParams
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const { tracking, origin, username, password } = params;

    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Login.name,
      tracking.requestId
    );

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(params)}`
    );

    if (!origin) {
      throw this.generateMissingOriginError(tracking.requestId);
    }

    try {
      const { realm, id: tenantId } = await this.GetTenantFromOriginUrl(
        tracking.requestId,
        origin
      );
      const applicationId = await this.getTransactApplicationId(
        tracking,
        tenantId
      );

      const loginResponse = await this.authenticationService.Login(
        tracking.requestId,
        {
          username,
          password,
          realmId: realm,
          applicationId,
        }
      );

      this.#logger.debug(
        `${logPrefix} Output data: ${JsonUtils.Stringify(loginResponse)}.`
      );

      return loginResponse;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${error}`);
      throw error;
    }
  }

  private async getTransactApplicationId(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<string> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getTransactApplicationId.name,
      tracking.requestId
    );

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify({ tracking, tenantId })}`
    );

    try {
      const applications = await this.fusionAuthApplication.GetApplications({
        tracking,
        tenantId,
      });
      const transactApplication = applications.filter(({ name }) =>
        name.includes('bambu-go-transact')
      );
      if (transactApplication.length !== 1) {
        throw new Error(
          `Expected one transact application, but found ${transactApplication.length}`
        );
      }
      const applicationId = transactApplication[0].id;

      this.#logger.debug(`${logPrefix} Output data: ${applicationId}`);

      return applicationId;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${error}`);
      throw error;
    }
  }

  private generateMissingOriginError(requestId: string) {
    return new ErrorUtils.ColossusError(
      'Missing origin input',
      requestId,
      {},
      400,
      SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
    );
  }

  // The following are duplicated from libs/@bambu/server-connect/domains/src/investor/connect-investor-domain.service.ts

  public async GetTenantFromOriginUrl(
    requestId: string,
    origin: string
  ): Promise<PrismaModel.Tenant> {
    if (!origin) {
      throw this.generateMissingOriginError(requestId);
    }

    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantFromOriginUrl.name,
      requestId
    );
    const inputForLogging = {
      origin,
    };
    this.#logger.debug(
      `${loggingPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}`
    );
    try {
      this.#logger.log(
        `${loggingPrefix} Getting tenant by for origin ${origin}.`
      );
      const tenant = await this.connectTenantGoalTypeCentralDb.GetTenantFromUrl(
        origin
      );
      this.#logger.debug(
        `${loggingPrefix} Tenant: ${JsonUtils.Stringify(tenant)}.`
      );
      this.#logger.log(
        `${loggingPrefix} Acquired tenant for origin (${origin}).`
      );
      return tenant;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered getting tenant by URL. Input: ${inputForLogging} .Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async ResendVerificationOtp(
    params: IResendVerificationOtpParamsDto
  ): Promise<void> {
    const { requestId } = params.tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResendVerificationOtp.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(params)}.`
    );

    const { tracking, origin, email } = params;

    if (!origin) {
      throw this.generateMissingOriginError(requestId);
    }

    try {
      const { id: tenantId } = await this.GetTenantFromOriginUrl(
        requestId,
        origin
      );
      const faUser = await this.getAndEnsureFusionAuthUser(
        requestId,
        tenantId,
        email
      );
      this.#logger.debug(
        `${logPrefix} Found user in Fusion Auth: ${JsonUtils.Stringify(
          faUser
        )}.`
      );

      const { id: userId } = faUser;
      const userHadPendingOtp = await this.otpService.PendingOtpIsPresent(
        requestId,
        tenantId,
        userId,
        'INVESTOR_EMAIL_VERIFICATION'
      );

      if (!userHadPendingOtp) {
        this.#logger.log(
          `${logPrefix} User (${userId}) does not have a pending OTP. Aborting.`
        );
        return;
      }

      await this.sendInvestorPlatformOtp(
        tracking,
        tenantId,
        email,
        userId,
        OtpDto.EnumOtpMode.EMAIL
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async VerifyInvestorPlatformUserVerificationOtp(
    requestId: string,
    origin: string,
    payload: IColossusUserOtpRequestDto
  ): Promise<boolean> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyInvestorPlatformUserVerificationOtp.name,
      requestId
    );
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(payload)}.`
    );
    const { username, otp } = payload;
    if (!origin) {
      throw this.generateMissingOriginError(requestId);
    }
    try {
      const tenant = await this.GetTenantFromOriginUrl(requestId, origin);
      const { id: tenantId } = tenant;
      const faUser: User = await this.getAndEnsureFusionAuthUser(
        requestId,
        tenantId,
        username
      );
      this.#logger.debug(
        `${logPrefix} Found user in Fusion Auth: ${JsonUtils.Stringify(
          faUser
        )}.`
      );
      await this.guardAgainstUsersAccessingWrongApplication(
        requestId,
        faUser,
        tenantId,
        null
      );

      const { id: userId } = faUser;
      const userHadPendingOtp = await this.otpService.PendingOtpIsPresent(
        requestId,
        tenantId,
        userId,
        'INVESTOR_EMAIL_VERIFICATION'
      );

      if (!userHadPendingOtp) {
        return false;
      }

      const verified = await this.otpService.VerifyInvestorPlatformOtp(
        {
          requestId,
        },
        {
          otp,
          userId,
          mode: OtpDto.EnumOtpMode.EMAIL,
          tenantId,
          purpose: 'INVESTOR_EMAIL_VERIFICATION',
        }
      );

      if (!verified) {
        return false;
      }

      await this.fusionAuthUser.AdministrativelyVerifyUser(requestId, userId);

      return true;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async getAndEnsureFusionAuthUser(
    requestId: string,
    tenantId: string,
    username: string
  ) {
    const faUser = await this.fusionAuthUser.FindUserByLoginId(
      requestId,
      username,
      tenantId
    );
    if (!faUser) {
      this.handleUserNotFoundInIam(requestId, { tenantId, username });
    }
    return faUser;
  }

  private handleUserNotFoundInIam(requestId: string, metadata: unknown) {
    throw new ErrorUtils.ColossusError(
      'User not found in IAM.',
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_NOT_FOUND
    );
  }

  private async guardAgainstUsersAccessingWrongApplication(
    requestId: string,
    faUser: User,
    tenantId: string,
    applicationId: string | null
  ): Promise<void> {
    if (applicationId === null) {
      applicationId = await this.getTransactApplicationId(
        {
          requestId,
        },
        tenantId
      );
    }

    const registration = faUser.registrations.find(
      (x) => x.applicationId === applicationId
    );
    if (!registration) {
      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        'User not bound to application',
        requestId,
        { applicationId }
      );
    }
  }

  public async GetInvestorPlatformUserProfile(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<IInvestorPlatformProfileDto> {
    const { requestId, requesterId } = tracking;

    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);

    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorPlatformUserProfile.name,
      requestId
    );

    const loggingInput = {
      tracking,
      tenantId,
      origin,
    };

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
    );

    try {
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);

      const faUser = await this.guardAndGetFaUser(
        requestId,
        logPrefix,
        requesterId,
        tenantId
      );

      const profile = await this.investorCentralDb.GetInvestorProfile(
        requestId,
        faUser.id,
        tenantId
      );

      if (!profile) {
        throw new ErrorUtils.ColossusError(
          'Investor profile not found.',
          requestId,
          loggingInput
        );
      }

      return {
        ...profile,
        Goals: await this.appendPortfolioValueToGoals(
          requestId,
          tenantId,
          _.cloneDeep(profile.Goals)
        ),
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private guardTrackingInput(tracking: IColossusTrackingDto): void {
    const { requestId, requesterId } = tracking;

    // if (!applicationId) {
    //   throw new ErrorUtils.ColossusError(
    //     'Missing application ID in session tracker.',
    //     requestId,
    //     { tracking }
    //   );
    // }

    if (!requesterId) {
      throw new ErrorUtils.ColossusError(
        'Missing user ID in session tracker.',
        requestId,
        { tracking }
      );
    }
  }

  private guardOriginInput(requestId: string, origin: string): void {
    if (!origin) {
      throw this.generateMissingOriginError(requestId);
    }
  }

  private async guardTenantIdMatchesOrigin(
    requestId: string,
    origin: string,
    tenantId: string
  ): Promise<void> {
    const tenant = await this.GetTenantFromOriginUrl(requestId, origin);
    const originTenantId = tenant.id;

    if (originTenantId !== tenantId) {
      throw new ErrorUtils.ColossusError('Tenant ID mismatch.', requestId, {
        originTenantId,
        tenantId,
      });
    }
  }

  private async guardAndGetFaUser(
    requestId: string,
    logPrefix: string,
    requesterId: string,
    tenantId: string
  ) {
    const faUserResponse = await this.fusionAuthUser.GetTenantUserById(
      requestId,
      requesterId,
      tenantId
    );
    const { user: faUser } = faUserResponse;
    this.#logger.debug(
      `${logPrefix} Found user in Fusion Auth: ${JsonUtils.Stringify(faUser)}.`
    );
    await this.guardAgainstUsersAccessingWrongApplication(
      requestId,
      faUser,
      tenantId,
      null
    );

    return faUser;
  }

  public async SubmitKycToBrokerage(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: InvestorKycDto.IColossusKycRequestPayloadDto
  ): Promise<InvestorKycDto.IColossusKycResponsePayloadDto> {
    const { requestId, requesterId } = tracking;
    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SubmitKycToBrokerage.name,
      requestId
    );
    const loggingInput = {
      tracking,
      tenantId,
      origin,
      payload,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
    );
    try {
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const faUser = await this.guardAndGetFaUser(
        requestId,
        logPrefix,
        requesterId,
        tenantId
      );
      const userId: string = faUser.id;
      const { party, address } = payload;
      const partyApiPayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto =
        {
          ...party,
          clientReference: userId,
        };
      const partyResponse = await this.wealthKernelConnectorPartiesApi.Create(
        requestId,
        tenantId,
        partyApiPayload
      );

      this.#logger.debug(
        `${logPrefix} Party response: ${JsonUtils.Stringify(partyResponse)}.`
      );

      const { id: partnerAccountId } = partyResponse;

      const addressApiPayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto =
        {
          ...address,
          partyId: partnerAccountId,
          clientReference: userId,
        };

      const addressResponse =
        await this.wealthKernelConnectorPartiesApi.CreateAddressForParty(
          requestId,
          tenantId,
          partnerAccountId,
          addressApiPayload
        );

      this.#logger.debug(
        `${logPrefix} Address response: ${JsonUtils.Stringify(
          addressResponse
        )}.`
      );

      const email: string = faUser.email;

      const { type: partnerAccountType } = payload.account;

      const accountApiPayload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto =
        {
          ...payload.account,
          name: `${email}-${partnerAccountType}`,
          owner: partnerAccountId,
          clientReference: `${partnerAccountId}|${partnerAccountType}`,
        };

      const accountResponse =
        await this.wealthKernelConnectorPartiesApi.CreateAccountForParty(
          requestId,
          tenantId,
          partnerAccountId,
          accountApiPayload
        );

      this.#logger.debug(
        `${logPrefix} Account response: ${JsonUtils.Stringify(
          accountResponse
        )}.`
      );

      const dbRows =
        await this.investorCentralDb.UpsertInvestorPlatformUserAccount(
          requestId,
          {
            brokerage:
              SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL,
            data: null,
            partnerAccountId,
            partnerAccountType,
            investorPlatformUserId: userId,
            partnerAccountNumber: accountResponse.id,
          },
          userId
        );

      this.#logger.debug(
        `${logPrefix} DB rows: ${JsonUtils.Stringify(dbRows)}.`
      );

      return {
        party: partyResponse,
        addresses: [addressResponse],
        accounts: [accountResponse],
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetBrokerageProfileForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<InvestorKycDto.IColossusKycResponsePayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBrokerageProfileForInvestor.name,
      tracking.requestId
    );
    try {
      const [party, addresses, accounts] = await Promise.all([
        this.GetPartyForInvestor(tracking, tenantId, origin),
        this.GetAddressesForInvestor(tracking, tenantId, origin),
        this.GetAccountsForInvestor(tracking, tenantId, origin),
      ]);

      return {
        party,
        addresses,
        accounts,
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetPartyForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyForInvestor.name,
      requestId
    );
    try {
      this.guardTrackingInput(tracking);
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const faUser = await this.guardAndGetFaUser(
        requestId,
        logPrefix,
        requesterId,
        tenantId
      );
      const userId: string = faUser.id;
      const accounts = await this.guardAndEnsureInvestorPlatformAccounts(
        requestId,
        userId
      );

      // We assume there will only be one party for this guy.
      const account = accounts[0];
      const { partnerAccountId: partyId } = account;

      return await this.wealthKernelConnectorPartiesApi.GetParty(
        requestId,
        tenantId,
        partyId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async guardAndEnsureInvestorPlatformAccounts(
    requestId: string,
    userId: string
  ): Promise<IInvestorPlatformUserAccountDto[]> {
    const dbResult =
      await this.investorCentralDb.GetInvestorPlatformUserAccounts(
        requestId,
        userId
      );

    if (!dbResult || !Array.isArray(dbResult) || dbResult.length < 1) {
      throw new ErrorUtils.ColossusError(
        `No accounts found for user (${userId}).`,
        requestId,
        { userId },
        404
      );
    }

    return dbResult;
  }

  public async GetAddressesForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto[]
  > {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressesForInvestor.name,
      requestId
    );
    try {
      this.guardTrackingInput(tracking);
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const faUser = await this.guardAndGetFaUser(
        requestId,
        logPrefix,
        requesterId,
        tenantId
      );
      const userId: string = faUser.id;
      const accounts = await this.guardAndEnsureInvestorPlatformAccounts(
        requestId,
        userId
      );

      // We assume there will only be one party for this guy.
      const account = accounts[0];
      const { partnerAccountId: partyId } = account;

      const response =
        await this.wealthKernelConnectorPartiesApi.GetAddressesForParty(
          requestId,
          tenantId,
          partyId
        );

      return response.results;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetAccountsForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto[]> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAccountsForInvestor.name,
      requestId
    );
    try {
      this.guardTrackingInput(tracking);
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const faUser = await this.guardAndGetFaUser(
        requestId,
        logPrefix,
        requesterId,
        tenantId
      );
      const userId: string = faUser.id;
      const accounts = await this.guardAndEnsureInvestorPlatformAccounts(
        requestId,
        userId
      );

      // We assume there will only be one party for this guy.
      const account = accounts[0];
      const { partnerAccountId: partyId } = account;

      const response =
        await this.wealthKernelConnectorPartiesApi.GetAccountsForParty(
          requestId,
          tenantId,
          partyId
        );
      return response.results;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetInstrumentAssetClasses(
    tracking: IColossusTrackingDto
  ): Promise<IInstrumentAssetClassDto[]> {
    return await this.instrumentsCentralDb.GetInstrumentAssetClasses(
      tracking.requestId
    );
  }

  public async GetInstruments(
    tracking: IColossusTrackingDto,
    pageIndex: number,
    pageSize: number,
    searchString: string
  ): Promise<IInstrumentsSearchResponseDto> {
    return await this.instrumentsCentralDb.GetInstruments(
      tracking.requestId,
      pageIndex,
      pageSize,
      searchString
    );
  }

  public async GetBankAccountsForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto[]
  > {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsForParty.name,
      requestId
    );
    try {
      const wkParty = await this.GetPartyForInvestor(
        tracking,
        tenantId,
        origin
      );
      const response: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllBaseResponseDto<
        BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto[]
      > = await this.wealthKernelConnectorPartiesApi.GetBankAccountsForParty(
        requestId,
        tenantId,
        wkParty.id,
        {
          limit: 1000,
        }
      );
      return response.results;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetBankAccountsForPartyPaged(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsForPartyPaged.name,
      requestId
    );
    try {
      const wkParty = await this.GetPartyForInvestor(
        tracking,
        tenantId,
        origin
      );
      const response: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllBaseResponseDto<
        BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto[]
      > = await this.wealthKernelConnectorPartiesApi.GetBankAccountsForParty(
        requestId,
        tenantId,
        wkParty.id,
        input
      );
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CreateBankAccountForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
      'partyId' | 'clientReference'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateBankAccountForParty.name,
      requestId
    );
    try {
      const wkParty = await this.GetPartyForInvestor(
        tracking,
        tenantId,
        origin
      );
      const partyId: string = wkParty.id;
      const clientReferenceRaw = `${partyId}|${payload.accountNumber}|${payload.sortCode}`;
      const clientReference = crypto
        .createHash('md5')
        .update(clientReferenceRaw)
        .digest('hex');
      const response: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto =
        await this.wealthKernelConnectorPartiesApi.CreateBankAccountForParty(
          requestId,
          tenantId,
          partyId,
          {
            ...payload,
            partyId,
            clientReference,
          }
        );
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetDirectDebitMandatesByParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto[]
  > {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatesByParty.name,
      requestId
    );
    try {
      const wkParty = await this.GetPartyForInvestor(
        tracking,
        tenantId,
        origin
      );
      const { id: partyId } = wkParty;
      const response =
        await this.wealthKernelConnectorDirectDebitApi.ListMandates(
          requestId,
          tenantId,
          {
            partyId,
            limit: 1000,
          }
        );
      return response.results;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CreateDirectDebitMandateForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitMandateForParty.name,
      requestId
    );
    try {
      const bankAccounts = await this.GetBankAccountsForParty(
        tracking,
        tenantId,
        origin
      );
      const { id: bankAccountId, partyId } = bankAccounts[0];
      if (bankAccountId !== payload.bankAccountId) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Bank account ID mismatch.`,
          requestId,
          { payload, bankAccounts }
        );
      }
      if (partyId !== payload.partyId) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(`Party ID mismatch.`, requestId, {
          payload,
          bankAccounts,
        });
      }
      return await this.wealthKernelConnectorDirectDebitApi.CreateMandate(
        requestId,
        tenantId,
        payload
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetTransactModelPortfolioById(
    requestId: string,
    origin: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyInvestorPlatformUserVerificationOtp.name,
      requestId
    );
    const inputForLogging: Record<string, unknown> = {
      origin,
      id,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(inputForLogging)}.`
    );
    try {
      const tenant = await this.GetTenantFromOriginUrl(requestId, origin);
      const { id: tenantId } = tenant;
      const modelPortfolio =
        await this.transactModelPortfolioCentralDb.GetModelPortfolioById(
          requestId,
          tenantId,
          id
        );
      if (!modelPortfolio) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Model portfolio not found.`,
          requestId,
          { inputForLogging },
          404,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.MODEL_PORTFOLIO_NOT_FOUND
        );
      }
      return modelPortfolio;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetDirectDebitMandatePdf(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<[ArrayBuffer, string]> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatePdf.name,
      requestId
    );

    try {
      const mandates = await this.GetDirectDebitMandatesByParty(
        tracking,
        tenantId,
        origin
      );

      // check mandates with provided mandateId

      if (mandates.filter((x) => x.id === mandateId).length < 0) {
        throw new Error(
          `Invalid Data! Provided mandateId: ${mandateId} dosen't belong to ${tenantId} `
        );
      }

      const response =
        await this.wealthKernelConnectorDirectDebitApi.GetMandatePdf(
          requestId,
          tenantId,
          mandateId
        );

      return [response, 'application/pdf'];
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CancelDirectDebitMandate(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitMandateForParty.name,
      requestId
    );

    try {
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      await this.guardAndEnsureMandateBelongsToUser(tracking, {
        tenantId,
        mandateId,
        origin,
      });

      await this.wealthKernelConnectorDirectDebitApi.CancelMandate(
        requestId,
        tenantId,
        mandateId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetMandatePdfPreview(
    tracking: IColossusTrackingDto,
    tenantId: string,
    bankAccountId: string,
    origin: string
  ): Promise<[ArrayBuffer, string]> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandatePdfPreview.name,
      requestId
    );

    try {
      this.#logger.debug(`${logPrefix}: bankAccountId: ${bankAccountId} `);
      const bankAccounts = await this.GetBankAccountsForParty(
        tracking,
        tenantId,
        origin
      );

      if (bankAccounts.filter((x) => x.id === bankAccountId).length < 0) {
        throw new Error(
          `Invalid bankAccountId: ${bankAccountId} for ${tenantId} `
        );
      }

      const response =
        await this.wealthKernelConnectorDirectDebitApi.GetMandatePdfPreview(
          requestId,
          tenantId,
          bankAccountId
        );

      return [response, 'application/pdf'];
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetNextPossiblePaymentDate(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentDate.name,
      requestId
    );
    try {
      const mandates = await this.GetDirectDebitMandatesByParty(
        tracking,
        tenantId,
        origin
      );

      // check mandates with provided mandateId

      if (mandates.filter((x) => x.id === mandateId).length < 0) {
        throw new Error(
          `Invalid Data! Provided mandateId: ${mandateId} dosen't belong to ${tenantId} `
        );
      }

      return await this.wealthKernelConnectorDirectDebitApi.GetNextPossiblePaymentDate(
        requestId,
        tenantId,
        mandateId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetDirectDebitPayments(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto & {
      mandateId?: string;
      goalId?: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitPayments.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(payload)}.`);
    try {
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);

      this.guardGoalIdAndMandateIdForReadDirectDebitApis(requestId, payload);

      const apiInput: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto =
        {
          limit: payload.limit,
        };

      if (payload.after) {
        apiInput.after = payload.after;
      }

      if (payload.mandateId) {
        const { mandateId } = payload;
        await this.guardAndEnsureMandateBelongsToUser(tracking, {
          tenantId,
          mandateId,
          origin,
        });
        apiInput.mandateId = mandateId;
      }

      if (payload.goalId) {
        const wkPortfolio = await this.guardAndGetPortfolioByGoalId(requestId, {
          tenantId,
          goalId: payload.goalId,
        });
        apiInput.portfolioId = wkPortfolio.id;
      }

      return await this.wealthKernelConnectorDirectDebitApi.ListPayments(
        requestId,
        tenantId,
        apiInput
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async guardAndEnsureMandateBelongsToUser(
    tracking: IColossusTrackingDto,
    input: {
      mandateId: string;
      tenantId: string;
      origin: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.guardAndEnsureMandateBelongsToUser.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const { mandateId, tenantId, origin } = input;
      const [wkParty, mandate] = await Promise.all([
        this.GetPartyForInvestor(tracking, tenantId, origin),
        this.wealthKernelConnectorDirectDebitApi.GetMandateById(requestId, {
          mandateId,
          tenantId,
        }),
      ]);

      if (wkParty.id !== mandate.partyId) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Party does not have mandate.`,
          requestId,
          { input, wkParty },
          404
        );
      }

      return mandate;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CreateDirectDebitPayment(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto,
      'portfolioId'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitPayment.name,
      requestId
    );
    try {
      await this.guardAndEnsureMandateBelongsToUser(tracking, {
        tenantId,
        origin,
        mandateId: payload.mandateId,
      });

      const targetPortfolio = await this.getPortfolioByGoalId(requestId, {
        goalId,
        tenantId,
      });

      let portfolioId: string;

      if (!Array.isArray(targetPortfolio) || targetPortfolio.length < 1) {
        const newPortfolio = await this.createGoalPortfolio(
          tracking,
          tenantId,
          origin,
          goalId
        );
        portfolioId = newPortfolio.id;
      } else {
        portfolioId = targetPortfolio[0].id;
      }

      return await this.wealthKernelConnectorDirectDebitApi.CreatePayment(
        requestId,
        tenantId,
        {
          ...payload,
          portfolioId,
        }
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async createGoalPortfolio(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.createGoalPortfolio.name,
      requestId
    );
    const loggingPayload = {
      tracking,
      tenantId,
      origin,
      goalId,
      requesterId,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const [goalDetails, brokerageAccounts, wkParty] = await Promise.all([
        this.GetGoalDetails(tracking, tenantId, origin, goalId, false),
        this.GetAccountsForInvestor(tracking, tenantId, origin),
        this.GetPartyForInvestor(tracking, tenantId, origin),
      ]);

      const {
        ConnectPortfolioSummary: { TransactModelPortfolios },
        investorId,
      } = goalDetails;

      if (
        !Array.isArray(TransactModelPortfolios) ||
        TransactModelPortfolios.length < 1
      ) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `No model portfolios found for goal (${goalId}).`,
          requestId,
          { goalId },
          404
        );
      }

      const { partnerModelId } = TransactModelPortfolios[0];

      const creationMandate: BrokerageIntegrationServerDto.IMandateDto = {
        type: BrokerageIntegrationServerDto.MandateTypeEnum.NULL_MANDATE,
      };

      if (partnerModelId) {
        creationMandate.type =
          BrokerageIntegrationServerDto.MandateTypeEnum.DISCRETIONARY_MANDATE;
        creationMandate.modelId = partnerModelId;
      }

      if (!brokerageAccounts || brokerageAccounts.length < 1) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `No brokerage accounts found for investor (${investorId}).`,
          requestId,
          { investorId },
          404
        );
      }

      const { id: accountId } = brokerageAccounts[0];

      const creationPayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto =
        {
          mandate: creationMandate,
          name: `${investorId}|${goalId}`,
          accountId,
          currency: 'GBP',
          clientReference: goalId,
        };
      const { id: partyId } = wkParty;

      return await this.wealthKernelConnectorPartiesApi.CreatePortfolioForPartyAndAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        creationPayload
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CancelDirectDebitPayment(
    tracking: IColossusTrackingDto,
    tenantId: string,
    paymentId: string,
    origin: string
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelDirectDebitPayment.name,
      requestId
    );
    const loggingPayload = {
      tracking,
      tenantId,
      paymentId,
      origin,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const paymentData =
        await this.wealthKernelConnectorDirectDebitApi.GetPaymentById(
          requestId,
          tenantId,
          paymentId
        );
      const { mandateId } = paymentData;
      await this.guardAndEnsureMandateBelongsToUser(tracking, {
        mandateId,
        tenantId,
        origin,
      });

      await this.wealthKernelConnectorDirectDebitApi.CancelPayment(
        requestId,
        tenantId,
        paymentId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetGoalDetails(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    augmentWithBrokerageData: boolean
  ): Promise<IInvestorPlatformProfileGoalDto> {
    const { requestId, requesterId } = tracking;
    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);
    await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetGoalDetails.name,
      requestId
    );
    const loggingInput = {
      tracking,
      tenantId,
      origin,
      goalId,
      requesterId,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
    );
    try {
      const goal = await this.goalCentralDb.GetGoalForTenantInvestor(
        requestId,
        tenantId,
        goalId,
        requesterId
      );
      if (!goal) {
        throw new ErrorUtils.ColossusError(
          'Goal not found.',
          requestId,
          loggingInput,
          404
        );
      }

      if (!augmentWithBrokerageData) {
        return goal;
      }

      const goalWithValues = await this.appendPortfolioValueToGoals(
        requestId,
        tenantId,
        [goal]
      );

      return goalWithValues[0];
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetTransactionsForGoal(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    params: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto> {
    const { requestId, requesterId } = tracking;
    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);
    await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransactionsForGoal.name,
      requestId
    );
    const loggingInput = {
      tracking,
      tenantId,
      origin,
      goalId,
      requesterId,
      params,
    };
    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
    );
    try {
      // This is done just to make sure that the goal exists.
      // Probably we will need something smarter in the future.
      await this.GetGoalDetails(tracking, tenantId, origin, goalId, false);
      const wkPortfolios = await this.wealthKernelConnectorPortfoliosApi.List(
        requestId,
        tenantId,
        {
          limit: 1,
          clientReference: goalId,
        }
      );

      if (
        !wkPortfolios ||
        !Array.isArray(wkPortfolios.results) ||
        wkPortfolios.results.length < 1
      ) {
        return {
          results: [],
          paginationToken: null,
        };
      }

      const wkPortfolio = wkPortfolios.results[0];
      const { id: wkPortfolioId } = wkPortfolio;
      const apiRequestPayload: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto =
        {
          ...params,
          portfolioId: wkPortfolioId,
        };
      return await this.wealthKernelConnectorTransactionsApi.List(
        requestId,
        tenantId,
        apiRequestPayload
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetBankAccountForPartyByBankAccountId(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    bankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountForPartyByBankAccountId.name,
      requestId
    );
    try {
      const wkParty = await this.GetPartyForInvestor(
        tracking,
        tenantId,
        origin
      );
      const response =
        await this.wealthKernelConnectorPartiesApi.GetBankAccountForPartyByBankAccountId(
          requestId,
          tenantId,
          wkParty.id,
          bankAccountId
        );
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async appendPortfolioValueToGoals(
    requestId: string,
    tenantId: string,
    rawGoals: IInvestorPlatformProfileGoalDto[],
    batchSize = 10
  ): Promise<IInvestorPlatformProfileGoalDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.appendPortfolioValueToGoals.name,
      requestId
    );
    try {
      const valuations: BrokerageIntegrationServerDto.IBrokerageIntegrationValuationDto[] =
        [];
      const performanceMetrics: BrokerageIntegrationServerDto.IBrokerageIntegrationPerformanceDto[] =
        [];
      const bambuToWkPortfolioMapping: Map<string, string> = new Map();
      const goalsBatched = _.chain(rawGoals)
        .cloneDeep()
        .chunk(batchSize)
        .value();

      for (let i = 0; i < goalsBatched.length; i += 1) {
        const goalIds = goalsBatched[i].map((goal) => goal.id);
        const goalPortfolios = await Promise.all(
          goalIds.map((id) => {
            return this.wealthKernelConnectorPortfoliosApi.List(
              requestId,
              tenantId,
              {
                clientReference: id,
                limit: 1,
              }
            );
          })
        );
        const viableGoalPortfolios = _.chain(goalPortfolios)
          .filter(
            (x) =>
              x?.results && Array.isArray(x.results) && x.results.length > 0
          )
          .map((x) => x.results)
          .flatten()
          .cloneDeep()
          .value();

        if (viableGoalPortfolios.length < 1) {
          continue;
        }

        viableGoalPortfolios.forEach((viableGoalPortfolio) => {
          bambuToWkPortfolioMapping.set(
            viableGoalPortfolio.clientReference,
            viableGoalPortfolio.id
          );
        });

        const goalValuations = await Promise.all(
          viableGoalPortfolios.map((viableGoalPortfolio) => {
            const { id: portfolioId, createdAt } = viableGoalPortfolio;
            return this.getLatestPortfolioValuation(requestId, {
              portfolioId,
              tenantId,
              goalInceptionDateIsoString: createdAt,
            });
          })
        );

        const validGoalValuations = _.chain(goalValuations)
          .filter(
            (x) =>
              x?.results && Array.isArray(x.results) && x.results.length > 0
          )
          .map((x) => x.results)
          .flatten()
          .cloneDeep()
          .value();

        if (validGoalValuations.length > 0) {
          valuations.push(...validGoalValuations);
        }

        const goalPerformanceMetrics = await Promise.all(
          viableGoalPortfolios.map((viableGoalPortfolio) => {
            const { id: portfolioId, createdAt: startDateIsoString } =
              viableGoalPortfolio;
            const endDateIsoString = Luxon.DateTime.utc()
              .toJSDate()
              .toISOString();
            return this.getLatestPortfolioPerformance(requestId, {
              tenantId,
              aggregate: true,
              portfolioId,
              startDateIsoString,
              endDateIsoString,
            });
          })
        );

        const validGoalPerformanceMetrics = _.chain(goalPerformanceMetrics)
          .filter(
            (x) =>
              x && x.results && Array.isArray(x.results) && x.results.length > 0
          )
          .map((x) => x.results)
          .flatten()
          .cloneDeep()
          .value();

        if (validGoalPerformanceMetrics.length > 0) {
          performanceMetrics.push(...validGoalPerformanceMetrics);
        }
      }

      const updatedProfileGoals = _.chain(rawGoals)
        .cloneDeep()
        .map((x) => {
          const { id } = x;
          const wkPortfolioId = bambuToWkPortfolioMapping.get(id);
          const defaultTimeStamp = Luxon.DateTime.utc().toISODate();
          const updatedResult: IInvestorPlatformProfileGoalDto = {
            ...x,
            portfolioValue: null,
            portfolioValueCurrency: null,
            portfolioValueDate: defaultTimeStamp,
            portfolioCumulativeReturn: null,
            portfolioCumulativeReturnDate: defaultTimeStamp,
          };

          if (!wkPortfolioId) {
            return updatedResult;
          }

          const valuation = valuations.find(
            (v) => v.portfolioId === wkPortfolioId
          );

          if (valuation) {
            updatedResult.portfolioValue = valuation.value.amount;
            updatedResult.portfolioValueCurrency = valuation.value.currency;
            updatedResult.portfolioValueDate = valuation.date;
          }

          const performanceMetric = performanceMetrics.find(
            (x) => x.portfolioId === wkPortfolioId
          );

          if (performanceMetric) {
            updatedResult.portfolioCumulativeReturn =
              performanceMetric.netPerformance;
            updatedResult.portfolioCumulativeReturnDate =
              performanceMetric.calculatedAt;
          }

          return {
            ...updatedResult,
          };
        })
        .value();

      this.#logger.debug(
        `Updated profile goals: ${JsonUtils.Stringify(updatedProfileGoals)}`
      );

      return updatedProfileGoals;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);

      if (error instanceof ErrorUtils.ColossusError) {
        if (
          error.colossusErrorCode ===
          SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
            .TENANT_NOT_BOUND_TO_BROKERAGE
        ) {
          this.#logger.log(
            `${logPrefix} Returning goal data without augmented data from brokerage.`
          );
          // TODO: Unify this with the logic above that returns goals with brokerage data.
          const defaultTimeStamp = Luxon.DateTime.utc().toISODate();
          return rawGoals.map((x) => {
            return {
              ...x,
              portfolioValue: null,
              portfolioValueCurrency: null,
              portfolioValueDate: defaultTimeStamp,
              portfolioCumulativeReturn: null,
              portfolioCumulativeReturnDate: defaultTimeStamp,
            };
          });
        }
      }

      throw error;
    }
  }

  public async GetGoalsForTenantInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IInvestorPlatformProfileGoalDto[]> {
    const { requestId, requesterId } = tracking;

    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);

    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetGoalsForTenantInvestor.name,
      requestId
    );

    const loggingInput = {
      tracking,
      tenantId,
      origin,
      requesterId,
    };

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
    );

    try {
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);

      const goals = await this.goalCentralDb.GetGoalsForTenantInvestor(
        requestId,
        tenantId,
        pageIndex,
        pageSize,
        requesterId
      );
      return await this.appendPortfolioValueToGoals(requestId, tenantId, goals);
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetCountOfGoalsForTenantInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<number> {
    const { requestId, requesterId } = tracking;
    this.guardTrackingInput(tracking);
    this.guardOriginInput(requestId, origin);
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetCountOfGoalsForTenantInvestor.name,
      requestId
    );
    const loggingInput = {
      tracking,
      tenantId,
      origin,
      requesterId,
    };
    try {
      this.#logger.debug(
        `${logPrefix} Input data: ${JsonUtils.Stringify(loggingInput)}.`
      );
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      return await this.goalCentralDb.GetCountOfGoalsForTenantInvestor(
        requestId,
        tenantId,
        requesterId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetDirectDebitSubscriptions(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
      'portfolioId'
    > & { goalId: string }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatesByParty.name,
      requestId
    );

    try {
      this.guardTrackingInput(tracking);
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);

      this.guardGoalIdAndMandateIdForReadDirectDebitApis(requestId, payload);

      const apiPayload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto =
        {
          limit: payload.limit,
        };

      if (payload.after) {
        apiPayload.after = payload.after;
      }

      if (payload.mandateId) {
        const { mandateId } = payload;
        await this.guardAndEnsureMandateBelongsToUser(tracking, {
          tenantId,
          mandateId,
          origin,
        });
        apiPayload.mandateId = payload.mandateId;
      }

      if (payload.goalId) {
        const wkPortfolio = await this.guardAndGetPortfolioByGoalId(requestId, {
          tenantId,
          goalId: payload.goalId,
        });
        apiPayload.portfolioId = wkPortfolio.id;
      }

      if (payload.status) {
        apiPayload.status = payload.status;
      }

      const response =
        await this.wealthKernelConnectorDirectDebitApi.ListSubscriptions(
          requestId,
          tenantId,
          apiPayload
        );

      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}.`
      );

      return response;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private guardGoalIdAndMandateIdForReadDirectDebitApis(
    requestId: string,
    payload: {
      mandateId?: string;
      goalId?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  ): void {
    if (
      (payload.goalId === undefined || payload.goalId === null) &&
      (payload.mandateId === undefined || payload.mandateId === null)
    ) {
      throw new ErrorUtils.ColossusError(
        `Either goalId or mandateId must be provided.`,
        requestId,
        { payload },
        400
      );
    }
  }

  public async CreateDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto,
      'portfolioId'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitSubscription.name,
      requestId
    );
    const loggingPayload = { requestId, tenantId, payload };
    this.#logger.debug(
      `${logPrefix} StartL, Input data: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardAndEnsureMandateBelongsToUser(tracking, {
        tenantId,
        origin,
        mandateId: payload.mandateId,
      });

      const portfolios = await this.getPortfolioByGoalId(requestId, {
        goalId,
        tenantId,
      });

      let portfolioId: string;

      if (!Array.isArray(portfolios) || portfolios.length < 1) {
        const newPortfolio = await this.createGoalPortfolio(
          tracking,
          tenantId,
          origin,
          goalId
        );
        portfolioId = newPortfolio.id;
      } else {
        portfolioId = portfolios[0].id;
      }

      this.#logger.debug(`Portfolios: ${JsonUtils.Stringify(portfolios)}`);

      return await this.wealthKernelConnectorDirectDebitApi.CreateSubscription(
        requestId,
        tenantId,
        { ...payload, portfolioId }
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async guardAndGetPortfolioByGoalId(
    requestId: string,
    input: {
      tenantId: string;
      goalId: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const portfolio = await this.getPortfolioByGoalId(requestId, input);

    if (!portfolio || !Array.isArray(portfolio) || portfolio.length < 1) {
      throw new ErrorUtils.ColossusError(
        `Portfolio not found for goal.`,
        requestId,
        input,
        404
      );
    }

    return portfolio[0];
  }

  private async getPortfolioByGoalId(
    requestId: string,
    input: { tenantId: string; goalId: string }
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto[]
  > {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getPortfolioByGoalId.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const { goalId, tenantId } = input;

      const portfolios = await this.wealthKernelConnectorPortfoliosApi.List(
        requestId,
        tenantId,
        { clientReference: goalId, limit: 1 }
      );
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(portfolios)}.`
      );
      return portfolios.results;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async ListUpcomingDirectDebitSubscriptions(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  > {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingDirectDebitSubscriptions.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      subscriptionId,
    };
    this.#logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardDirectDebitSubscriptionUpdateApiMandate(tracking, {
        tenantId,
        origin,
        subscriptionId,
      });
      return await this.wealthKernelConnectorDirectDebitApi.ListUpcomingSubscriptions(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async UpdateDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateDirectDebitSubscription.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      subscriptionId,
      payload,
    };
    this.#logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardDirectDebitSubscriptionUpdateApiMandate(tracking, {
        tenantId,
        origin,
        subscriptionId,
      });

      return await this.wealthKernelConnectorDirectDebitApi.UpdateSubscription(
        requestId,
        tenantId,
        subscriptionId,
        payload
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CancelDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelDirectDebitSubscription.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      subscriptionId,
    };
    this.#logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardDirectDebitSubscriptionUpdateApiMandate(tracking, {
        tenantId,
        origin,
        subscriptionId,
      });

      return await this.wealthKernelConnectorDirectDebitApi.CancelSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async guardDirectDebitSubscriptionUpdateApiMandate(
    tracking: IColossusTrackingDto,
    input: {
      origin: string;
      tenantId: string;
      subscriptionId: string;
    }
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.guardDirectDebitSubscriptionUpdateApiMandate.name
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const { subscriptionId, origin, tenantId } = input;
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const subscription =
        await this.wealthKernelConnectorDirectDebitApi.GetSubscriptionById(
          requestId,
          tenantId,
          subscriptionId
        );
      const { mandateId } = subscription;
      await this.guardAndEnsureMandateBelongsToUser(tracking, {
        tenantId,
        origin,
        mandateId,
      });
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async PauseDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseDirectDebitSubscription.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      subscriptionId,
    };
    this.#logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardDirectDebitSubscriptionUpdateApiMandate(tracking, {
        tenantId,
        origin,
        subscriptionId,
      });
      return await this.wealthKernelConnectorDirectDebitApi.PauseSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async ResumeDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResumeDirectDebitSubscription.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      subscriptionId,
    };
    this.#logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardDirectDebitSubscriptionUpdateApiMandate(tracking, {
        tenantId,
        origin,
        subscriptionId,
      });
      return await this.wealthKernelConnectorDirectDebitApi.ResumeSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  private async getLatestPortfolioValuation(
    requestId: string,
    input: {
      tenantId: string;
      portfolioId: string;
      goalInceptionDateIsoString: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getLatestPortfolioValuation.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);

    try {
      const baseDateIsoString = Luxon.DateTime.utc().startOf('day').toISO();
      const boundaryDate = Luxon.DateTime.fromISO(
        input.goalInceptionDateIsoString
      ).startOf('day');
      let minusDays = 1;
      const maxDays = 14;
      let iterate = true;
      const responsePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto =
        {
          results: [],
          paginationToken: null,
        };

      do {
        const targetDate = Luxon.DateTime.fromISO(baseDateIsoString)
          .minus({ days: minusDays })
          .startOf('day');

        if (
          boundaryDate.toMillis() === targetDate.toMillis() ||
          minusDays > maxDays
        ) {
          iterate = false;
          break;
        }

        const response = await this.wealthKernelConnectorValuationsApi.List(
          requestId,
          input.tenantId,
          {
            portfolioId: input.portfolioId,
            limit: 1000,
            endDate: Luxon.DateTime.fromISO(baseDateIsoString).toISODate(),
            startDate: boundaryDate.toISODate(),
            updatedSince: targetDate.toJSDate().toISOString(),
          }
        );

        if (response.results.length > 0) {
          responsePayload.paginationToken = response.paginationToken;
          responsePayload.results.length = 0;
          // responsePayload.results.push(...response.results);
          responsePayload.results.push(_.first(response.results));
        }

        minusDays += 1;

        if (
          response.results.length > 0 ||
          boundaryDate.toMillis() === targetDate.toMillis() ||
          minusDays > maxDays
        ) {
          iterate = false;
        }
      } while (iterate === true);

      return responsePayload;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      this.#logger.error(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);
      throw error;
    }
  }

  private async getLatestPortfolioPerformance(
    requestId: string,
    input: {
      tenantId: string;
      portfolioId: string;
      aggregate: boolean;
      startDateIsoString: string;
      endDateIsoString: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getLatestPortfolioPerformance.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);
    try {
      /**
       * My observation is that the latest will always be on top.
       * We will go with that assumption for now.
       */
      const {
        tenantId,
        portfolioId,
        endDateIsoString,
        aggregate,
        startDateIsoString,
      } = input;

      const brokerageResponse =
        await this.wealthKernelConnectorPerformanceApi.List(
          requestId,
          tenantId,
          {
            portfolioId,
            endDate: Luxon.DateTime.fromISO(endDateIsoString).toISODate(),
            startDate: Luxon.DateTime.fromISO(startDateIsoString).toISODate(),
            aggregate,
            limit: 1000,
          }
        );

      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(brokerageResponse)}`
      );

      if (brokerageResponse.results.length > 0) {
        return {
          results: [brokerageResponse.results[0]],
          paginationToken: brokerageResponse.paginationToken,
        };
      }

      return brokerageResponse;
      /**
       * Old reference code in case we need to fall back.
       */
      // const { startDateIsoString } = input;
      // const baseDateIsoString = Luxon.DateTime.utc().startOf('day').toISO();
      // const boundaryDate =
      //   Luxon.DateTime.fromISO(startDateIsoString).startOf('day');
      // let minusDays = 1;
      // const maxDays = 14;
      // let iterate = true;
      // const responsePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto =
      //   {
      //     results: [],
      //     paginationToken: null,
      //   };
      // const { tenantId, portfolioId, endDateIsoString, aggregate } = input;
      // do {
      //   const targetDate = Luxon.DateTime.fromISO(baseDateIsoString)
      //     .minus({ days: minusDays })
      //     .startOf('day');
      //
      //   if (
      //     boundaryDate.toMillis() === targetDate.toMillis() ||
      //     minusDays > maxDays
      //   ) {
      //     iterate = false;
      //     break;
      //   }
      //
      //   const brokerageResponse =
      //     await this.wealthKernelConnectorPerformanceApi.List(
      //       requestId,
      //       tenantId,
      //       {
      //         portfolioId,
      //         endDate: Luxon.DateTime.fromISO(endDateIsoString).toISODate(),
      //         startDate: boundaryDate.toISODate(),
      //         aggregate,
      //         limit: 1000,
      //         updatedSince: targetDate.toJSDate().toISOString(),
      //       }
      //     );
      //
      //   if (brokerageResponse.results.length > 0) {
      //     responsePayload.paginationToken = brokerageResponse.paginationToken;
      //     responsePayload.results.length = 0;
      //     // responsePayload.results.push(...response.results);
      //     responsePayload.results.push(_.first(brokerageResponse.results));
      //   }
      //
      //   minusDays += 1;
      //
      //   if (
      //     brokerageResponse.results.length > 0 ||
      //     boundaryDate.toMillis() === targetDate.toMillis() ||
      //     minusDays > maxDays
      //   ) {
      //     iterate = false;
      //   }
      // } while (iterate === true);
      //
      // return responsePayload;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      this.#logger.error(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);
      throw error;
    }
  }

  public async GetHoldingsForGoal(
    tracking: IColossusTrackingDto,
    input: {
      tenantId: string;
      origin: string;
      goalId: string;
    }
  ): Promise<ITransactPortfolioHoldingsDto[]> {
    const { requestId } = tracking;
    this.guardTrackingInput(tracking);
    const { origin, tenantId } = input;
    this.guardOriginInput(requestId, origin);
    await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetHoldingsForGoal.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);
    try {
      const { goalId } = input;

      const currentGoal = await this.GetGoalDetails(
        tracking,
        tenantId,
        origin,
        goalId,
        false
      );

      const {
        ConnectPortfolioSummary: { TransactModelPortfolios },
      } = currentGoal;

      if (
        !Array.isArray(TransactModelPortfolios) ||
        TransactModelPortfolios.length < 1
      ) {
        return [];
      }

      const transactModelPortfolio = TransactModelPortfolios[0];
      const { TransactModelPortfolioInstruments } = transactModelPortfolio;

      if (
        !Array.isArray(TransactModelPortfolioInstruments) ||
        TransactModelPortfolioInstruments.length < 1
      ) {
        return [];
      }

      // const wkPortfolio = await this.guardAndGetPortfolioByGoalId(requestId, {
      //   tenantId,
      //   goalId: goalId,
      // });

      const wkPortfolioSearchResult = await this.getPortfolioByGoalId(
        requestId,
        {
          goalId,
          tenantId,
        }
      );

      if (
        !Array.isArray(wkPortfolioSearchResult) ||
        wkPortfolioSearchResult.length < 1
      ) {
        return [];
      }

      const wkPortfolio = wkPortfolioSearchResult[0];
      const { id: wkPortfolioId } = wkPortfolio;
      const valuation = await this.getLatestPortfolioValuation(requestId, {
        tenantId,
        portfolioId: wkPortfolioId,
        // portfolioId: 'prt-36hesdn77242su',
        goalInceptionDateIsoString: wkPortfolio.createdAt,
      });

      const payload = TransactModelPortfolioInstruments.map((x) => {
        const updatedObject: ITransactPortfolioHoldingsDto = {
          ...x,
          units: 0,
          price: 0,
          currentValue: 0,
          valuationDate: Luxon.DateTime.utc().toISODate(),
          currency: null,
        };

        if (valuation.results.length > 0) {
          const data = valuation.results[0];
          const { date } = data;
          updatedObject.valuationDate = date;

          if (x.Instrument.isin.indexOf('CASH_') > -1) {
            const { cash } = data;
            if (Array.isArray(cash) && cash.length > 0) {
              const cashItem = cash[0];
              updatedObject.currency = cashItem.currency;
              updatedObject.units = cashItem.amount.amount;
              updatedObject.price = cashItem.fxRate;
              updatedObject.currentValue = cashItem.value.amount;
            }
          } else {
            const { holdings } = data;
            const {
              Instrument: { isin },
            } = updatedObject;
            const holding = holdings.find((x) => x.isin === isin);

            if (holding) {
              updatedObject.currency = holding.value.currency;
              updatedObject.units = holding.quantity;
              updatedObject.price = holding.price.amount;
              updatedObject.currentValue = holding.value.amount;
            }
          }
        }

        return updatedObject;
      });
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(payload)}`
      );
      return payload;
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async ListWithdrawalsForGoal(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: IColossusListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListWithdrawalsForGoal.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(payload)}.`);
    try {
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const { goalId, limit } = payload;
      const apiInput: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto = {
        limit,
      };
      const wkPortfolio = await this.guardAndGetPortfolioByGoalId(requestId, {
        tenantId,
        goalId,
      });
      apiInput.portfolioId = wkPortfolio.id;
      return this.wealthKernelConnectorWithdrawalsApi.List(
        requestId,
        tenantId,
        apiInput
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async CreateWithdrawalRequest(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: IColossusWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateWithdrawalRequest.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(payload)}.`);
    try {
      this.guardOriginInput(requestId, origin);
      await this.guardTenantIdMatchesOrigin(requestId, origin, tenantId);
      const { bankAccountId, goalId } = payload;
      const [wkPortfolio, wKBank] = await Promise.all([
        this.guardAndGetPortfolioByGoalId(requestId, {
          tenantId,
          goalId,
        }),
        this.GetBankAccountForPartyByBankAccountId(
          tracking,
          tenantId,
          origin,
          bankAccountId
        ),
      ]);
      const apiPayload: IBrokerageIntegrationWithdrawalMutableDto = {
        bankAccountId: wKBank.id,
        closePortfolio: payload.closePortfolio,
        type: payload.type,
        portfolioId: wkPortfolio.id,
        consideration: payload.consideration,
        reference: payload.reference,
      };
      return await this.wealthKernelConnectorWithdrawalsApi.Create(
        requestId,
        tenantId,
        apiPayload
      );
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }
}
