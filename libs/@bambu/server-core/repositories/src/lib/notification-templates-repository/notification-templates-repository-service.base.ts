import { IGenerateTemplatedMessageInput } from './i-generate-templated-message.input';

export abstract class NotificationTemplatesRepositoryServiceBase {
  public abstract GenerateTemplatedMessage(
    input: IGenerateTemplatedMessageInput
  ): Promise<string>;
}
