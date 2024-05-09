import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ConnectTenantDto } from '@bambu/shared';

export class ConnectTenantGetGoalTypesResponseItemDto
  implements ConnectTenantDto.IConnectTenantGoalTypeForTenantDto
{
  @ApiProperty({
    type: 'string',
    example: 'fb371304-b9b3-430d-bdf9-8a1c19cc0b93',
    description: 'A UUID identifying the goal type.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'Retirement',
    description: 'The name of the goal type.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'Retirement',
    description: 'Retire comfortably.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Whether the tenant is currently set to offer this goal type.',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}

export class ConnectTenantGetGoalTypesResponseDto {
  @ApiProperty({
    type: [ConnectTenantGetGoalTypesResponseItemDto],
    description:
      'An array of UUIDs corresponding to the goal types available on the platform.',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  goalTypes: ConnectTenantGetGoalTypesResponseItemDto[];
}
