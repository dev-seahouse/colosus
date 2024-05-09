// noinspection ES6PreferShortImport

import { TransactInvestorDto } from '@bambu/server-core/dto';
import { ILaunchPlatformParameters } from './i-launch-platform.parameters';
import { IPleaseAwaitAppointmentTemplateParametersDto } from './i-please-await-appointment.parameters';
import { IResetPasswordOtpParameters } from './i-reset-password-otp.parameters';
import { IScheduleAppointmentTemplateParametersDto } from './i-schedule-appointment.parameters';
import { ISendInvestmentPlanToLeadParametersDto } from './i-send-investment-plan-to-lead-parameters.dto';
import { IVerifyAccountOtpParameters } from './i-verify-account-otp.parameters';
import { IGenerateMjmlTemplateForSendingToWKParams } from './i-wk-update-bank-account.parameters';
import { IGenerateMJMLTemplateForUpdatePortfolioDataWKParams } from './i-wk-update-portfolio-data.parameters.dto';
export type ITemplateParameters =
  | ILaunchPlatformParameters
  | IVerifyAccountOtpParameters
  | ISendInvestmentPlanToLeadParametersDto
  | IResetPasswordOtpParameters
  | IPleaseAwaitAppointmentTemplateParametersDto
  | IScheduleAppointmentTemplateParametersDto
  | TransactInvestorDto.IInvestorLoginVerificationTemplateParametersDto
  | IGenerateMjmlTemplateForSendingToWKParams
  | IGenerateMJMLTemplateForUpdatePortfolioDataWKParams;
