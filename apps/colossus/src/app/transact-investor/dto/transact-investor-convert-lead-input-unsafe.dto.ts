import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactInvestorConvertLeadInputUnsafeDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'The email of the lead.',
    required: true,
    example: 'john.doe@email.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'hunter2',
    description: 'The password of the user.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
