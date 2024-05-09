import { HeartbeatApiMessageDto } from './heartbeat-api-message.dto';

export abstract class HeartbeatServiceBase {
  public abstract GetHeartbeatMessage(): HeartbeatApiMessageDto;
}
