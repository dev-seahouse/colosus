import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from '@bambu/shared';

export class AccountChangePasswordRequestDto
  implements
    Omit<IamDto.IIamAccountChangePasswordRequestDto, 'username' | 'tenantName'>
{
  // TODO: may be extended in future to support admins changing clients' passwords

  @ApiProperty({
    type: 'string',
    example: 'hunter3',
    description: 'The new password of the user.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
