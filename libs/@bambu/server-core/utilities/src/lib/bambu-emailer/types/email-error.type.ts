import { EmailTransportOptions } from './email-transport-options.type';

export type EmailError = {
  transport: EmailTransportOptions;
  error: unknown;
};
