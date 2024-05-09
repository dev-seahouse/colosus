import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  GoalCentralDbRepositoryServiceBase,
  TransactModelPortfolioCentralDbRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { GoalStatusEnum } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { ApisServiceBase } from './apis/apis.service';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(
    private readonly apisService: ApisServiceBase,
    private readonly transactModelPortfolioCentralDb: TransactModelPortfolioCentralDbRepositoryServiceBase,
    private readonly goalCentralDbRepositoryService: GoalCentralDbRepositoryServiceBase
  ) {}

  public async Run(): Promise<void> {
    const requestId = crypto.randomUUID();
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Run.name,
      requestId
    );
    this.logger.log(`${logPrefix} Start.`);

    let pageIndex = 0;
    const pageSize = 100;
    let itemsPresent = true;

    do {
      const results = await this.getTenants(requestId, pageIndex, pageSize);
      const numberOfItems = results.length;

      if (numberOfItems < 1) {
        itemsPresent = false;
        break;
      }

      for (let i = 0; i < numberOfItems; i++) {
        await this.processTenant(requestId, results[i]);
      }

      pageIndex += 1;
    } while (itemsPresent === true);

    this.logger.log(`${logPrefix} End.`);
  }

  private async getTenants(
    requestId: string,
    pageIndex = 0,
    pageSize = 100
  ): Promise<string[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getTenants.name,
      requestId
    );
    this.logger.debug(`${logPrefix} Start.`);
    try {
      const tenants: string[] = await this.apisService.GetTenants(
        requestId,
        pageIndex,
        pageSize
      );
      this.logger.debug(`${logPrefix} End.`);
      return tenants;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  private async processTenant(
    requestId: string,
    tenantId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.processTenant.name,
      requestId
    );
    this.logger.log(`${logPrefix} Start. Processing tenant: ${tenantId}.`);

    this.logger.log(`${logPrefix} Getting investment models for ${tenantId}.`);

    let itemsRemain = true;
    const pageSize = 100;
    let token: string | undefined = undefined;
    const investmentModels: BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDto[] =
      [];

    do {
      const items = await this.apisService.GetWkInvestmentModels(
        requestId,
        tenantId,
        pageSize,
        token
      );

      if (items.results.length < 1) {
        itemsRemain = false;
        break;
      }

      this.logger.log(
        `${logPrefix} Acquired ${items.results.length} investment models for ${tenantId}.`
      );
      this.logger.log(
        `${logPrefix} Investment models acquired: ${JsonUtils.Stringify(
          items
        )}.`
      );
      investmentModels.push(...items.results);

      if (!items.paginationToken) {
        itemsRemain = false;
        break;
      }

      token = items.paginationToken;
    } while (itemsRemain === true);

    this.logger.log(
      `${logPrefix} Finished getting investment models for ${tenantId}.`
    );
    this.logger.log(
      `${logPrefix} Total investment models acquired: ${investmentModels.length}.`
    );
    this.logger.log(
      `${logPrefix} Investment models acquired: ${JsonUtils.Stringify(
        investmentModels
      )}.`
    );

    this.logger.log(`${logPrefix} Getting model portfolios for tenant.`);
    const modelPortfolios =
      await this.transactModelPortfolioCentralDb.GetModelPortfoliosForTenant(
        requestId,
        tenantId
      );
    this.logger.log(
      `${logPrefix} Finished getting model portfolios for tenant.`
    );

    if (modelPortfolios.length < 1) {
      this.logger.log(
        `${logPrefix} No model portfolios found for tenant. Aborting.`
      );
      return;
    }

    this.logger.log(
      `${logPrefix} Model portfolios acquired: ${JsonUtils.Stringify(
        modelPortfolios
      )}.`
    );

    for (let i = 0; i < modelPortfolios.length; i += 1) {
      const modelPortfolio = modelPortfolios[i];
      const portfolioItems: BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioComponentDto[] =
        _.chain(modelPortfolio.TransactModelPortfolioInstruments)
          .map((x) => {
            const {
              weightage,
              Instrument: { isin: isinRaw },
            } = x;

            const isin = isinRaw.indexOf('CASH_') > -1 ? 'CASH' : isinRaw;

            return {
              weight: Number.parseFloat(weightage.toFixed(2)),
              isin,
            };
          })
          .cloneDeep()
          .value();

      const sortedPortfolioItems = _.sortBy(portfolioItems, 'isin');

      const indexOfWkModel = _.findIndex(investmentModels, (model) => {
        const sortedComponents = _.sortBy(model.components, 'isin');
        return _.isEqual(sortedComponents, sortedPortfolioItems);
      });

      if (indexOfWkModel < 0) {
        this.logger.log(
          `${logPrefix} The model portfolio (${modelPortfolio.id}) for tenant (${tenantId}) does not have a matching WK model. Moving onto the next.`
        );
        continue;
      }

      const { partnerModelId } = modelPortfolio;

      const wkModel = investmentModels[indexOfWkModel];
      const { id: wkModelId } = wkModel;

      if (partnerModelId !== wkModelId) {
        this.logger.log(
          `${logPrefix} The model portfolio (${modelPortfolio.id}) for tenant ${tenantId} has a matching WK model (${wkModelId}) but the partner model ID does not match. Updating the partner model ID to match the WK model ID.`
        );
        await this.transactModelPortfolioCentralDb.UpdateTransactModelPortfolioPartnerModelId(
          requestId,
          modelPortfolio.id,
          wkModelId
        );
      }
    }

    this.logger.log(
      `${logPrefix} Getting goals with active accounts for tenant.`
    );
    const modelIds = _.chain(investmentModels)
      .cloneDeep()
      .map((x) => x.id)
      .value();
    await this.syncGoalMandatesTenantActiveUsers(requestId, tenantId, modelIds);

    this.logger.log(`${logPrefix} End. Processed tenant: ${tenantId}.`);
  }

  private async syncGoalMandatesTenantActiveUsers(
    requestId: string,
    tenantId: string,
    modelIds: string[]
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.syncGoalMandatesTenantActiveUsers.name,
      requestId
    );
    this.logger.log(`${logPrefix} Start. Processing tenant: ${tenantId}.`);
    this.logger.log(
      `${logPrefix} Getting goals with active accounts for tenant.`
    );

    let itemsRemain = true;
    const pageSize = 10;
    let pageIndex = 0;

    do {
      const goals =
        await this.goalCentralDbRepositoryService.GetGoalsForActiveWealthKernelAccounts(
          requestId,
          tenantId,
          modelIds,
          pageIndex,
          pageSize
        );

      if (goals.length < 1) {
        itemsRemain = false;
        break;
      }

      for (let i = 0; i < goals.length; i += 1) {
        const goal = goals[i];

        const {
          status,
          id: goalId,
          Investor: { InvestorPlatformUsers },
        } = goal;

        const { InvestorPlatformUserAccounts } = InvestorPlatformUsers[0];

        const { partnerAccountNumber } = InvestorPlatformUserAccounts[0];

        const wkPortfolio =
          await this.apisService.GetWkPortfolioByClientReference(
            requestId,
            tenantId,
            partnerAccountNumber,
            goalId
          );

        if (!wkPortfolio) {
          this.logger.debug(
            `${logPrefix} No WK portfolio found for goal (${goalId}).`
          );
          continue;
        }

        this.logger.debug(
          `${logPrefix} WK Portfolio found for goal (${goalId}): ${JsonUtils.Stringify(
            wkPortfolio
          )}.`
        );

        const currentStatus: string = String(wkPortfolio.status).toUpperCase();

        if (currentStatus !== status) {
          this.logger.debug(
            `${logPrefix} WK Portfolio status (${currentStatus}) does not match goal status (${status}). Updating goal status to match WK Portfolio status.`
          );
          await this.goalCentralDbRepositoryService.UpdateGoalStatus(
            requestId,
            goalId,
            currentStatus as unknown as GoalStatusEnum
          );
        }

        if (
          goal.ConnectPortfolioSummary &&
          goal.ConnectPortfolioSummary?.TransactModelPortfolios[0] &&
          wkPortfolio.mandate.type !==
            BrokerageIntegrationServerDto.MandateTypeEnum.DISCRETIONARY_MANDATE
        ) {
          const { partnerModelId } =
            goal.ConnectPortfolioSummary.TransactModelPortfolios[0];
          if (wkPortfolio.mandate.modelId !== partnerModelId) {
            const updatedMandate: BrokerageIntegrationServerDto.IMandateDto = {
              type: BrokerageIntegrationServerDto.MandateTypeEnum
                .DISCRETIONARY_MANDATE,
              modelId: partnerModelId,
            };
            const wkPortfolioId = wkPortfolio.id;
            this.logger.debug(
              `${logPrefix} WK Portfolio mandate model ID (${wkPortfolio.mandate.modelId}) does not match goal model ID (${partnerModelId}). Updating WK Portfolio mandate model ID to match goal model ID.`
            );
            const result = await this.apisService.UpdateWkPortfolioMandate(
              requestId,
              wkPortfolioId,
              tenantId,
              updatedMandate
            );
            this.logger.debug(
              `${logPrefix} WK Portfolio mandate model ID update result: ${JsonUtils.Stringify(
                result
              )}.`
            );
          }
        }
      }

      pageIndex += 1;
    } while (itemsRemain === true);
  }
}
