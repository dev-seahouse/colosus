import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectInvestorGetTenantIdDto {
  @ApiProperty({
    type: 'string',
    example: 'fb371304-b9b3-430d-bdf9-8a1c19cc0b93',
    description: 'A UUID identifying the tenant type.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tenantId: string;
}
