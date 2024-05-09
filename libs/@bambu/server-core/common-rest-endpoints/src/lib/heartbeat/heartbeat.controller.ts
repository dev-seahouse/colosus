import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { HeartbeatServiceBase } from './heartbeat.service.base';

import { HeartbeatApiMessageDto } from './heartbeat-api-message.dto';
import { Public } from '@bambu/server-core/common-guards';

@ApiTags('Health')
@ApiExtraModels(HeartbeatApiMessageDto)
@Controller({
  version: VERSION_NEUTRAL,
})
export class HeartbeatController {
  constructor(private readonly service: HeartbeatServiceBase) {}

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    description:
      'Endpoint to welcome API callers and support default "/" API call for default AWS FarGate heartbeat checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful heartbeat message.',
    schema: {
      $ref: getSchemaPath(HeartbeatApiMessageDto),
    },
  })
  public GetHeartbeat() {
    return this.service.GetHeartbeatMessage();
  }
}
