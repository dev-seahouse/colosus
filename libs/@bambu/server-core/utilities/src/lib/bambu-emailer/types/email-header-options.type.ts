import { EmailMailbox } from './email-mailbox.type';

export type EmailHeaderOptions = {
  from: string | EmailMailbox;
  to: string | (string | EmailMailbox)[];
  subject: string;
};
