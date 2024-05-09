import { EmailContentOptions } from './email-content.type';
import { EmailHeaderOptions } from './email-header-options.type';
import { EmailTransportOptions } from './email-transport-options.type';

export type BambuEmailSendPayload = {
  transport?: EmailTransportOptions;
  header: EmailHeaderOptions;
  body: EmailContentOptions;
};
