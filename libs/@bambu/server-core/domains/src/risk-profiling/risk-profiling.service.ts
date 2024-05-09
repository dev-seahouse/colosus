import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { RiskProfilingDomainServiceBase } from './risk-profiling.service.base';
import { RiskProfilingCentralDbService } from '@bambu/server-core/repositories';
import {
  IGetLatestQuestionnaireVersion,
  IRiskProfileDto,
  IGetRiskQuestionnaire,
} from '@bambu/shared';

@Injectable()
export class RiskProfilingDomainService
  implements RiskProfilingDomainServiceBase
{
  readonly #logger = new Logger(RiskProfilingDomainService.name);
  constructor(
    private readonly riskProfilingDbRepo: RiskProfilingCentralDbService
  ) {}

  public async GetRiskProfiles(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IRiskProfileDto[] | null> {
    const { tenantId, requestId } = params;
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetRiskProfiles.name,
      requestId
    );

    try {
      this.#logger.log(
        `${logPrefix} Getting Riskprofiles for tenant(${tenantId})`
      );

      const riskProfiles = await this.riskProfilingDbRepo.GetRiskProfiles(
        tenantId,
        requestId
      );

      return riskProfiles;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting risk profiles: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public async GetLatestRiskQuestionnaireVersionNumber(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IGetLatestQuestionnaireVersion | null> {
    const { tenantId, requestId } = params;
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetLatestRiskQuestionnaireVersionNumber.name,
      requestId
    );
    try {
      const results =
        await this.riskProfilingDbRepo.GetLatestRiskQuestionnaireVersionNumber({
          tenantId,
          requestId,
        });
      return results;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting risk questionnaire version number: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public async GetRiskQuestionnaire(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IGetRiskQuestionnaire> {
    const { tenantId, requestId } = params;
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetRiskQuestionnaire.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Getting Risk Questionnaires for tenant(${tenantId})`
    );

    try {
      const results = await this.riskProfilingDbRepo.GetRiskQuestionnaire({
        tenantId,
        requestId,
      });

      return results;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting risk questionnaires for tenant (${tenantId}) Error: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }
}
