import { ConnectLeadsDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ConnectAdvisorLeadsUpdateRequestDto
  implements ConnectLeadsDto.IConnectLeadAdvisorUpdateApiDto
{
  @ApiProperty({
    type: 'string',
    enum: SharedEnums.LeadsEnums.EnumLeadStatus,
    example: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
    description: 'The status of the lead.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(SharedEnums.LeadsEnums.EnumLeadStatus)
  status: SharedEnums.LeadsEnums.EnumLeadStatus;
}
