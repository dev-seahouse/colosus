import { EmailError, EmailResponseInfo } from './types';
import { BambuEmailSendPayload } from './types/bambu-email-send-payload.type';

export abstract class BambuEmailerServiceBase {
  abstract sendEmail(
    emailDefinition: BambuEmailSendPayload
  ): Promise<EmailResponseInfo | EmailError>;
}
