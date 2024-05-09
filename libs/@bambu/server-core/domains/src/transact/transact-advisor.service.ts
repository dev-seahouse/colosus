// noinspection ES6PreferShortImport

import {
  IOpenPGPConfigDto,
  IWealthKernelEmailsConfigDto,
} from '@bambu/server-core/configuration';
import { Enums } from '@bambu/server-core/constants';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  BlobRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  IGenerateMjmlTemplateForSendingToWKParams,
  IGenerateMJMLTemplateForUpdatePortfolioDataWKParams as IWKPortfolioUpdateEmailPayloadDto,
  InstrumentsCentralDbRepositoryServiceBase,
  NotificationRepositoryServiceBase,
  NotificationTemplateChannelEnum,
  NotificationTemplatesRepositoryServiceBase,
  NotificationTypeEnum,
  TemplateNameEnum,
  TenantCentralDbRepositoryService,
  TransactAdvisorCentralDbRepositoryServiceBase,
  TransactModelPortfolioCentralDbRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import {
  CryptographyUtils,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IGetModelPortfolioByIdResponseDto,
  ITenantTransactBrokerageDto,
  ITransactAdvisorBankAccountDto,
  ITransactAdvisorBankAccountMutableDto,
  ITransactModelPortfolioDto,
  ITransactPortfolioInstrumentDto,
  ITransactPortfolioInstrumentMutableDto,
  ITransactAdvisorBankAccountEmailPayloadDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

export interface ISetModelPortfolioFactSheetDocumentParamsDto {
  tenantId: string;
  modelPortfolioId: string;
  filePath: string;
  fileName: string;
  fileMimeType: string;
}

export abstract class TransactAdvisorServiceBase {
  public abstract CreateModelPortfolio(
    tracking: IColossusTrackingDto,
    tenantId: string,
    payload: ITransactModelPortfolioDto
  ): Promise<ITransactModelPortfolioDto>;

  public abstract GetModelPortfoliosForTenant(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITransactModelPortfolioDto[]>;

  public abstract GetModelPortfoliosForTenantById(
    tracking: IColossusTrackingDto,
    tenantId: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto>;

  public abstract UpsertTransactModelPortfolioInstruments(
    tracking: IColossusTrackingDto,
    tenantId: string,
    modelPortfolioId: string,
    payload: ITransactPortfolioInstrumentMutableDto[]
  ): Promise<ITransactPortfolioInstrumentDto[]>;

  public abstract SetModelPortfolioFactSheetDocument(
    tracking: IColossusTrackingDto,
    input: ISetModelPortfolioFactSheetDocumentParamsDto
  ): Promise<void>;

  public abstract GetTenantTransactBrokerageMetadata(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITenantTransactBrokerageDto[]>;

  public abstract GetTransactAdvisorBankAccountDetails(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITransactAdvisorBankAccountDto>;

  public abstract UpsertTransactAdvisorBankAccountDetails(
    tracking: IColossusTrackingDto,
    tenantId: string,
    input: ITransactAdvisorBankAccountMutableDto
  ): Promise<void>;
}

@Injectable()
export class TransactAdvisorService implements TransactAdvisorServiceBase {
  private readonly logger: Logger = new Logger(TransactAdvisorService.name);

  constructor(
    private readonly transactModelPortfolioCentralDb: TransactModelPortfolioCentralDbRepositoryServiceBase,
    private readonly blobRepository: BlobRepositoryServiceBase,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly transactAdvisorCentralDb: TransactAdvisorCentralDbRepositoryServiceBase,
    private readonly openPgpConfigService: ConfigService<IOpenPGPConfigDto>,
    private readonly wkEmailConfig: ConfigService<IWealthKernelEmailsConfigDto>,
    private readonly notificationTemplatesRepository: NotificationTemplatesRepositoryServiceBase,
    private readonly notificationRepository: NotificationRepositoryServiceBase,
    private readonly fusionAuthIamUser: FusionAuthIamUserRepositoryServiceBase,
    private readonly instrumentsCentralDb: InstrumentsCentralDbRepositoryServiceBase
  ) {}

  public async CreateModelPortfolio(
    tracking: IColossusTrackingDto,
    tenantId: string,
    payload: ITransactModelPortfolioDto
  ): Promise<ITransactModelPortfolioDto> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateModelPortfolio.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tenantId,
      requesterId,
      payload,
    };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const createdBy: string = requesterId;
      const updatedBy: string = requesterId;
      const dbPayload: ITransactModelPortfolioDto = {
        ...payload,
        createdBy,
        updatedBy,
        id: payload.connectPortfolioSummaryId,
      };
      const response =
        await this.transactModelPortfolioCentralDb.UpsertTransactModelPortfolio(
          requestId,
          tenantId,
          dbPayload
        );
      this.logger.debug(
        `${logPrefix} Output: ${JsonUtils.Stringify(response)}`
      );
      return response;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async GetModelPortfoliosForTenant(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITransactModelPortfolioDto[]> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateModelPortfolio.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tenantId,
      requesterId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const response =
        await this.transactModelPortfolioCentralDb.GetModelPortfoliosForTenant(
          requestId,
          tenantId
        );
      this.logger.debug(
        `${logPrefix} Output: ${JsonUtils.Stringify(response)}`
      );
      return response;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async GetModelPortfoliosForTenantById(
    tracking: IColossusTrackingDto,
    tenantId: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfoliosForTenantById.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tenantId,
      requesterId,
      id,
    };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const response =
        await this.transactModelPortfolioCentralDb.GetModelPortfolioById(
          requestId,
          tenantId,
          id
        );

      if (!response) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Model Portfolio not found.`,
          requestId,
          loggingInput,
          404
        );
      }

      this.logger.debug(
        `${logPrefix} Output: ${JsonUtils.Stringify(response)}`
      );
      return response;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async UpsertTransactModelPortfolioInstruments(
    tracking: IColossusTrackingDto,
    tenantId: string,
    modelPortfolioId: string,
    payload: ITransactPortfolioInstrumentMutableDto[]
  ): Promise<ITransactPortfolioInstrumentDto[]> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertTransactModelPortfolioInstruments.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tenantId,
      requesterId,
      payload,
    };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );

      const idCount: { [key: string]: number } = {};
      const duplicates: string[] = [];

      for (const item of payload) {
        if (idCount[item.instrumentId]) {
          idCount[item.instrumentId]++;
          if (idCount[item.instrumentId] === 2) {
            // only add once for each duplicate
            duplicates.push(item.instrumentId);
          }
        } else {
          idCount[item.instrumentId] = 1;
        }
      }

      if (duplicates.length > 0) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Duplicate instrument IDs found: [${duplicates.join(', ')}].`,
          requestId,
          { ...loggingInput },
          400
        );
      }

      const totalWeightage = payload.reduce((acc, x) => acc + x.weightage, 0);
      const totalRounded = Math.round(totalWeightage * 100) / 100;

      if (totalRounded != 1) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          `Total weightage must be 1. Current total weightage is ${totalRounded}.`,
          requestId,
          { ...loggingInput },
          400
        );
      }

      await this.transactModelPortfolioCentralDb.DeleteTransactPortfolioInstrumentsByModelPortfolioId(
        requestId,
        tenantId,
        modelPortfolioId
      );

      const response = await Promise.all(
        payload.map((x) => {
          return this.transactModelPortfolioCentralDb.UpsertTransactModelPortfolioInstrument(
            requestId,
            tenantId,
            x,
            requesterId
          );
        })
      );

      // Assemble data for the payload

      const emailPayloadData = await this.AssemblePortfolioDataForWkEmail(
        tracking,
        tenantId,
        response,
        modelPortfolioId
      );

      // Send Email to Wealth Kernel

      await this.SendEmailToWealthKernelWithPortfolioConfig(
        requestId,
        tenantId,
        emailPayloadData
      );

      this.logger.debug(
        `${logPrefix} Output: ${JsonUtils.Stringify(response)}`
      );
      return response;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async SetModelPortfolioFactSheetDocument(
    tracking: IColossusTrackingDto,
    input: ISetModelPortfolioFactSheetDocumentParamsDto
  ): Promise<void> {
    const { requestId, requesterId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SetModelPortfolioFactSheetDocument.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      input,
      tracking,
    };
    this.logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
    );
    try {
      const { tenantId, modelPortfolioId } = input;
      const existingModelPortfolioData =
        await this.GetModelPortfoliosForTenantById(
          tracking,
          tenantId,
          modelPortfolioId
        );

      await this.purgeModelPortfolioExistingFactSheet(
        requestId,
        existingModelPortfolioData?.factSheetUrl
      );
      const { filePath, fileName, fileMimeType } = input;

      const upsertPortfolio = _.cloneDeep(existingModelPortfolioData);
      upsertPortfolio.factSheetUrl =
        await this.blobRepository.CreatePublicBlobFromLocalFile(
          filePath,
          fileMimeType,
          Enums.FileUpload.Paths.DOCUMENTS,
          fileName
        );

      if (upsertPortfolio.TransactModelPortfolioInstruments) {
        delete upsertPortfolio.TransactModelPortfolioInstruments;
      }

      await this.CreateModelPortfolio(tracking, tenantId, {
        ...upsertPortfolio,
        updatedBy: requesterId,
      });
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  private async purgeModelPortfolioExistingFactSheet(
    requestId: string,
    factSheetUrl?: string | null
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.purgeModelPortfolioExistingFactSheet.name,
      requestId
    );
    try {
      if (!factSheetUrl) {
        return;
      }

      await this.blobRepository.DeleteBlob(factSheetUrl);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Failed to delete existing file. Non-critical error. See next line for details.`
      );
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
    }
  }

  public async GetTenantTransactBrokerageMetadata(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITenantTransactBrokerageDto[]> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantTransactBrokerageMetadata.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tracking,
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
    );
    try {
      return await this.tenantCentralDb.GetTenantTransactBrokerageMetadata(
        requestId,
        {
          tenantId,
        }
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async UpsertTransactAdvisorBankAccountDetails(
    tracking: IColossusTrackingDto,
    tenantId: string,
    input: ITransactAdvisorBankAccountMutableDto
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertTransactAdvisorBankAccountDetails.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tracking,
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
    );

    try {
      // Encrypt the data with PGP
      const encryptedBankAccountNumber = await this.EncryptBankAccountConfig(
        requestId,
        input.accountNumber,
        'BankAccountNumber'
      );

      const encryptedBankAccountName = await this.EncryptBankAccountConfig(
        requestId,
        input.accountName,
        'BankAccountName'
      );

      const encryptedBankAccountSortCode = await this.EncryptBankAccountConfig(
        requestId,
        input.sortCode,
        'BankAccountSortCode'
      );

      const encryptedAMUFee = await this.EncryptBankAccountConfig(
        requestId,
        input.annualManagementFee,
        'Annual Managment Fee'
      );

      // Add to Database

      const encryptedPayload: ITransactAdvisorBankAccountMutableDto = {
        accountName: encryptedBankAccountName.encryptedContentBase64,
        accountNumber: encryptedBankAccountNumber.encryptedContentBase64,
        sortCode: encryptedBankAccountSortCode.encryptedContentBase64,
        annualManagementFee: encryptedAMUFee.encryptedContentBase64,
        tenantId,
      };

      await this.transactAdvisorCentralDb.UpsertBankAccountDetailsByTenantId(
        requestId,
        encryptedPayload
      );

      // Trigger an Email to wealthKernel
      const { requesterId } = tracking;
      const faUser = await this.fusionAuthIamUser.GetTenantUserById(
        requestId,
        requesterId,
        tenantId
      );
      const emailPayload = {
        tenantId: tenantId,
        tenantEmail: faUser.user.email,
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        sortCode: input.sortCode,
        annualManagementFee: input.annualManagementFee,
      };

      await this.SendEmailToWealthKernel(requestId, tenantId, emailPayload);
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async GetTransactAdvisorBankAccountDetails(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ITransactAdvisorBankAccountDto> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransactAdvisorBankAccountDetails.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = {
      tracking,
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
    );

    try {
      // Get the Data from Database

      const dbRow = await this.transactAdvisorCentralDb.GetBankAccountDetails(
        requestId,
        tenantId
      );
      const { accountName, accountNumber, sortCode, annualManagementFee } =
        dbRow;
      // Decrypt the data with PGP

      const bankAccountNumber = await this.DecryptBankAccountConfig(
        requestId,
        accountNumber,
        'Bank Account Number'
      );

      const bankAccountName = await this.DecryptBankAccountConfig(
        requestId,
        accountName,
        'Bank Account Number'
      );

      const bankSortCode = await this.DecryptBankAccountConfig(
        requestId,
        sortCode,
        'Bank Account Sort Code'
      );

      const amuFee = await this.DecryptBankAccountConfig(
        requestId,
        annualManagementFee,
        'Annual Management Fee'
      );

      // Return the results

      const results = {
        ...dbRow,
        accountName: bankAccountName,
        accountNumber: bankAccountNumber,
        sortCode: bankSortCode,
        annualManagementFee: amuFee,
        tenantId: tenantId,
      };
      return results;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  private async EncryptBankAccountConfig(
    requestId: string,
    content: string,
    conentType?: string
  ): Promise<CryptographyUtils.IEncryptContentResultDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.EncryptBankAccountConfig.name,
      requestId
    );

    this.logger.debug(
      `${logPrefix} Encrypting: ${conentType} ${JsonUtils.Stringify(requestId)}`
    );
    try {
      const config = this.openPgpConfigService.getOrThrow('openPGPConfig', {
        infer: true,
      });

      const { pgpPrivateKeyBase64, pgpPublicKeyBase64, pgpPassphrase } = config;

      const encryptionPayload = {
        content: content,
        publicKeyBase64: pgpPublicKeyBase64,
        privateKeyBase64: pgpPrivateKeyBase64,
        passphrase: pgpPassphrase,
      };

      const encryptedData = await CryptographyUtils.encryptContent(
        encryptionPayload
      );

      return encryptedData;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error while encrypting ${conentType}: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  private async DecryptBankAccountConfig(
    requestId: string,
    content: string,
    contentType?: string
  ): Promise<string> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DecryptBankAccountConfig.name,
      requestId
    );

    this.logger.debug(
      `${logPrefix} Decrypting: ${contentType} ${JsonUtils.Stringify(
        requestId
      )}`
    );

    try {
      const config = this.openPgpConfigService.getOrThrow('openPGPConfig', {
        infer: true,
      });

      const { pgpPrivateKeyBase64, pgpPublicKeyBase64, pgpPassphrase } = config;

      const decryptedString = await CryptographyUtils.decryptContent({
        passphrase: pgpPassphrase,
        encryptedContentBase64: content,
        publicKeyBase64: pgpPublicKeyBase64,
        privateKeyBase64: pgpPrivateKeyBase64,
      });

      return decryptedString;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error while Decrypting ${contentType}: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  private async SendEmailToWealthKernel(
    requestId: string,
    tenantId: string,
    payload: ITransactAdvisorBankAccountEmailPayloadDto
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SendEmailToWealthKernel.name,
      requestId
    );

    this.logger.debug(`${logPrefix} Start:`);

    try {
      // Get Wealth Kernel Email Address

      const wkEmailsConfig = this.wkEmailConfig.getOrThrow(
        'wealthKernelEmailsConfig',
        {
          infer: true,
        }
      );
      const { wkTenantsEmailAddress } = wkEmailsConfig;

      // Need to implment tenant email id
      const emailBody =
        await this.notificationTemplatesRepository.GenerateTemplatedMessage({
          templateName: TemplateNameEnum.WK_UPDATE_BANK_ACCOUNT_DETAILS,
          channel: NotificationTemplateChannelEnum.EMAIL,
          parameters: {
            tenantId: tenantId,
            tenantEmail: payload.tenantEmail,
            accountName: payload.accountName,
            accountNumber: payload.accountNumber,
            sortCode: payload.sortCode,
            annualManagementFee: payload.annualManagementFee,
          } as IGenerateMjmlTemplateForSendingToWKParams,
        });

      this.logger.debug(
        `${logPrefix} Generated email body. Body: ${emailBody}.`
      );

      await this.notificationRepository.NotifyUser({
        body: emailBody,
        to: wkTenantsEmailAddress,
        subject: 'Bambu - Advisor Bank Account Update',
        type: NotificationTypeEnum.EMAIL,
      });
      return;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error while sending email to wealthkernel for ${tenantId} ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  private async AssemblePortfolioDataForWkEmail(
    tracking: IColossusTrackingDto,
    tenantId: string,
    portfolioInstruments: ITransactPortfolioInstrumentDto[],
    modelPortfolioId: string
  ): Promise<IWKPortfolioUpdateEmailPayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SendEmailToWealthKernelWithPortfolioConfig.name,
      tracking.requestId
    );

    try {
      const instrumentIds = portfolioInstruments.map((instrtument) => {
        return instrtument.instrumentId;
      });

      // Get all instrumnets from the Db
      const instrumentList =
        await this.instrumentsCentralDb.GetInstrumentsByIds(
          tracking.requestId,
          instrumentIds
        );

      const mappedInstruments = portfolioInstruments.map((portfolioItem) => {
        const instrumentDetails = instrumentList.find(
          (instrument) => instrument.id === portfolioItem.instrumentId
        );
        return {
          id: portfolioItem.instrumentId,
          weightage: portfolioItem.weightage,
          isin: instrumentDetails.isin,
        };
      });

      // Get tenant's email

      const faUser = await this.fusionAuthIamUser.GetTenantUserById(
        tracking.requestId,
        tracking.requesterId,
        tenantId
      );

      // Get Model Portfolio Metadata

      const modelPortfolioMetaData = await this.GetModelPortfoliosForTenantById(
        tracking,
        tenantId,
        modelPortfolioId
      );

      const modelPortfolioDetails = {
        id: modelPortfolioMetaData.id,
        name: modelPortfolioMetaData.name,
        description: modelPortfolioMetaData.description,
      };

      const emailPayload = {
        modelPortfolioDetails,
        tenantEmail: faUser.user.email,
        payload: mappedInstruments,
      };

      return emailPayload;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  private async SendEmailToWealthKernelWithPortfolioConfig(
    requestId: string,
    tenantId: string,
    payload: IWKPortfolioUpdateEmailPayloadDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SendEmailToWealthKernelWithPortfolioConfig.name,
      requestId
    );

    this.logger.debug(`${logPrefix} Start:`);

    try {
      const wkEmailsConfig = this.wkEmailConfig.getOrThrow(
        'wealthKernelEmailsConfig',
        {
          infer: true,
        }
      );
      const { wkInvestmentsEmailAddress } = wkEmailsConfig;

      const emailBody =
        await this.notificationTemplatesRepository.GenerateTemplatedMessage({
          templateName: TemplateNameEnum.WK_UPDATE_MODEL_PORTFOLIO_DETAILS,
          channel: NotificationTemplateChannelEnum.EMAIL,
          parameters: {
            modelPortfolioDetails: payload.modelPortfolioDetails,
            payload: payload.payload,
            tenantEmail: payload.tenantEmail,
          },
        });

      this.logger.debug(
        `${logPrefix} Generated email body. Body: ${emailBody}.`
      );

      await this.notificationRepository.NotifyUser({
        body: emailBody,
        to: wkInvestmentsEmailAddress,
        subject: 'Bambu - Advisor Portfolio Config Update',
        type: NotificationTypeEnum.EMAIL,
      });
      return;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error while sending email to wealthkernel for ${tenantId} ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }
}
