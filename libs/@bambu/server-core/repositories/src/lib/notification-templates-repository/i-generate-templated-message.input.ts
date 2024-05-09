import { ITemplateParameters } from './i-template-parameters';
import { NotificationTemplateChannelEnum } from './notification-template-channel.enum';
import { TemplateNameEnum } from './template-name.enum';

export interface IGenerateTemplatedMessageInput {
  channel: NotificationTemplateChannelEnum;
  templateName: TemplateNameEnum;
  parameters: ITemplateParameters;
}
