import { Module } from '@nestjs/common';
import { HeartbeatController } from './heartbeat.controller';
import { HeartbeatService } from './heartbeat.service';
import { HeartbeatServiceBase } from './heartbeat.service.base';

@Module({
  imports: [],
  providers: [
    {
      provide: HeartbeatServiceBase,
      useClass: HeartbeatService,
    },
  ],
  controllers: [HeartbeatController],
})
export class HeartbeatModule {}
