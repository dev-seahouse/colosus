import { Injectable } from '@nestjs/common';
import { HeartbeatApiMessageDto } from './heartbeat-api-message.dto';
import { HeartbeatServiceBase } from './heartbeat.service.base';

@Injectable()
export class HeartbeatService implements HeartbeatServiceBase {
  public GetHeartbeatMessage(): HeartbeatApiMessageDto {
    const message = new HeartbeatApiMessageDto();

    message.Message = `Ah la vache !! Ze service is running !! Vive La Pier....I mean France !!`;
    message.TimeStamp = new Date().toISOString();
    message.Uptime = Math.floor(process.uptime());
    return message;
  }
}
