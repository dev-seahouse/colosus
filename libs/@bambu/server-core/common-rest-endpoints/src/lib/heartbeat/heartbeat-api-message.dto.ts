import { IWelcomeMessageDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class HeartbeatApiMessageDto implements IWelcomeMessageDto {
  @ApiProperty({
    description: 'A friendly message from a guy named Pierre.',
    name: 'message',
  })
  @Expose({ name: 'message' })
  Message: string;

  @ApiProperty({
    description: 'Time stamp of message.',
    type: 'string',
    format: 'date-time',
    name: 'timeStamp',
  })
  @Expose({ name: 'timeStamp' })
  TimeStamp: string;

  @ApiProperty({
    description: 'Uptime in seconds.',
    type: 'integer',
    format: 'int64',
    name: 'uptime',
  })
  @Expose({ name: 'uptime' })
  Uptime: number;
}
