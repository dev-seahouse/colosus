// noinspection ES6PreferShortImport

import { IAzureBlobStorageIntegrationConfigDto } from '@bambu/server-core/configuration';
import { GoalTypes } from '@bambu/server-core/db/central-db';
import { TransactInvestorDto } from '@bambu/server-core/dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import mjml2html from 'mjml';
import { IGenerateTemplatedMessageInput } from './i-generate-templated-message.input';
import { IPleaseAwaitAppointmentTemplateParametersDto } from './i-please-await-appointment.parameters';
import { IScheduleAppointmentTemplateParametersDto } from './i-schedule-appointment.parameters';
import { ISendInvestmentPlanToLeadParametersDto } from './i-send-investment-plan-to-lead-parameters.dto';
import { ITemplateParameters } from './i-template-parameters';
import { NotificationTemplateChannelEnum } from './notification-template-channel.enum';
import { NotificationTemplatesRepositoryServiceBase } from './notification-templates-repository-service.base';
import { TemplateNameEnum } from './template-name.enum';
import {
  GenerateInvestorLoginVerificationTemplate,
  GenerateMjmlTemplateForSendingInvestmentPlanToLead,
  GetLaunchedPlatformMjmlTemplate,
  GetResetPasswordMjmlTemplate,
  GetVerifyLoginMjmlTemplate,
  GenerateMjmlTemplateForSendingToWealthKernel,
  GenerateMjmlTemplateForSendingPortfolioConfigToWK,
} from './templates';
import { GeneratePleaseAwaitAppointmentTemplate } from './templates/please-await-appointment.mjml';
import { GenerateScheduleAppointmentTemplate } from './templates/schedule-appointment.mjml';
import { IGenerateMjmlTemplateForSendingToWKParams } from './i-wk-update-bank-account.parameters';
import { IGenerateMJMLTemplateForUpdatePortfolioDataWKParams } from './i-wk-update-portfolio-data.parameters.dto';
@Injectable()
export class NotificationTemplatesRepositoryService
  implements NotificationTemplatesRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    NotificationTemplatesRepositoryService.name
  );
  readonly #baseSystemAssetUrl: string;

  constructor(
    private readonly config: ConfigService<IAzureBlobStorageIntegrationConfigDto>
  ) {
    const blobConfig = this.config.getOrThrow('azureBlobStorage', {
      infer: true,
    });

    this.#baseSystemAssetUrl = blobConfig.systemAssets.publicBaseUrl;
  }

  public async GenerateTemplatedMessage(
    input: IGenerateTemplatedMessageInput
  ): Promise<string> {
    const debugMessage = [
      `Generating notification template.`,
      `Parameters ${JSON.stringify(input)}.`,
    ].join(' ');
    this.#logger.debug(debugMessage);

    const { channel } = input;

    if (channel === NotificationTemplateChannelEnum.EMAIL) {
      return await this.#generateEmailContent(input);
    }

    const errorMessage = [
      `Templates for channel does not exist.`,
      `Requested channel was ${channel}.`,
      `Supported channels [${JSON.stringify(
        Object.keys(NotificationTemplateChannelEnum).join(',')
      )}].`,
    ].join(' ');

    this.#logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  async #generateEmailContent(
    input: IGenerateTemplatedMessageInput
  ): Promise<string> {
    const { templateName, parameters, channel } = input;

    if (
      [
        TemplateNameEnum.RESET_PASSWORD_OTP,
        TemplateNameEnum.VERIFY_LOGIN_OTP,
        TemplateNameEnum.LAUNCH_PLATFORM,
        TemplateNameEnum.SEND_INVESTMENT_PLAN_TO_LEAD,
        TemplateNameEnum.SCHEDULE_APPOINTMENT,
        TemplateNameEnum.PLEASE_AWAIT_APPOINTMENT,
        TemplateNameEnum.INVESTOR_LOGIN_VERIFICATION_OTP,
        TemplateNameEnum.WK_UPDATE_BANK_ACCOUNT_DETAILS,
        TemplateNameEnum.WK_UPDATE_MODEL_PORTFOLIO_DETAILS,
      ].includes(templateName)
    ) {
      this.#logger.debug('Parameters:');
      this.#logger.debug(parameters);
      const { ejsTemplate, ejsParameters } = this.#getMjmlTemplate(
        templateName,
        parameters
      );

      const htmlContent = await ejs.render(
        ejsTemplate,
        { ...ejsParameters },
        {
          async: true,
        }
      );

      this.#logger.debug('Generated HTML email content.');
      this.#logger.debug(htmlContent);

      return htmlContent;
    }

    const templateNotSupportedErrorMessage = `Template  ${templateName} for the ${channel} channel does not exist.`;

    this.#logger.error(templateNotSupportedErrorMessage);
    throw new Error(templateNotSupportedErrorMessage);
  }

  #getMjmlTemplate(
    type: TemplateNameEnum,
    parameters: ITemplateParameters
  ): { ejsTemplate: string; ejsParameters: ejs.Data } {
    switch (type) {
      case TemplateNameEnum.VERIFY_LOGIN_OTP: {
        const mjmlParsingResult = mjml2html(
          GetVerifyLoginMjmlTemplate(this.#baseSystemAssetUrl)
        );
        return {
          ejsTemplate: mjmlParsingResult.html,
          ejsParameters: parameters as ejs.Data,
        };
      }
      case TemplateNameEnum.RESET_PASSWORD_OTP: {
        const mjmlParsingResult = mjml2html(
          GetResetPasswordMjmlTemplate(this.#baseSystemAssetUrl)
        );
        return {
          ejsTemplate: mjmlParsingResult.html,
          ejsParameters: parameters as ejs.Data,
        };
      }
      case TemplateNameEnum.LAUNCH_PLATFORM: {
        const mjmlParsingResult = mjml2html(
          GetLaunchedPlatformMjmlTemplate(this.#baseSystemAssetUrl)
        );
        return {
          ejsTemplate: mjmlParsingResult.html,
          ejsParameters: parameters as ejs.Data,
        };
      }
      case TemplateNameEnum.SEND_INVESTMENT_PLAN_TO_LEAD: {
        const input = parameters as ISendInvestmentPlanToLeadParametersDto;
        return GenerateMjmlTemplateForSendingInvestmentPlanToLead({
          input,
          goalType: input.lead.goalName as GoalTypes,
        });
      }
      case TemplateNameEnum.SCHEDULE_APPOINTMENT: {
        return GenerateScheduleAppointmentTemplate(
          parameters as IScheduleAppointmentTemplateParametersDto
        );
      }
      case TemplateNameEnum.PLEASE_AWAIT_APPOINTMENT: {
        return GeneratePleaseAwaitAppointmentTemplate(
          parameters as IPleaseAwaitAppointmentTemplateParametersDto
        );
      }
      case TemplateNameEnum.INVESTOR_LOGIN_VERIFICATION_OTP: {
        return GenerateInvestorLoginVerificationTemplate(
          parameters as TransactInvestorDto.IInvestorLoginVerificationTemplateParametersDto
        );
      }
      case TemplateNameEnum.WK_UPDATE_BANK_ACCOUNT_DETAILS: {
        return GenerateMjmlTemplateForSendingToWealthKernel(
          parameters as IGenerateMjmlTemplateForSendingToWKParams,
          this.#baseSystemAssetUrl
        );
      }
      case TemplateNameEnum.WK_UPDATE_MODEL_PORTFOLIO_DETAILS: {
        return GenerateMjmlTemplateForSendingPortfolioConfigToWK(
          this.#baseSystemAssetUrl,
          parameters as IGenerateMJMLTemplateForUpdatePortfolioDataWKParams
        );
      }

      default:
        break;
    }

    const errorMessage = [
      `Template does not exist.`,
      `Template requested is ${type}.`,
      `Supported values are [${JSON.stringify(
        Object.keys(TemplateNameEnum).join(',')
      )}].`,
    ].join(' ');

    this.#logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
