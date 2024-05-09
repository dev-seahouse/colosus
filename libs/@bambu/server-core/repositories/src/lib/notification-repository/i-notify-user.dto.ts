import { NotificationTypeEnum } from './notification-type.enum';

export interface INotifyUserDto {
  to: string;
  from?: string;
  subject: string;
  body: string;
  type: NotificationTypeEnum;
}
