import { ConnectTenantDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectTenantSetTopLevelOptionsRequestDto
  implements ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto
{
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 100000,
    description: 'Income threshold for investor still in the workforce.',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  incomeThreshold: number;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 100000,
    description: 'Savings threshold for a retired investor.',
  })
  @IsInt()
  @IsNotEmpty()
  retireeSavingsThreshold: number;

  @ApiProperty({
    type: 'string',
    format: 'uri',
    example: 'https://www.bambu.life',
    description: 'Link to the contact page of the tenant.',
    default: null,
    deprecated: true,
  })
  @IsString()
  @IsOptional()
  contactLink?: string | null = null;
}
