import { INotifyUserDto } from './i-notify-user.dto';

export abstract class NotificationRepositoryServiceBase {
  public abstract NotifyUser(input: INotifyUserDto): Promise<void>;
}
