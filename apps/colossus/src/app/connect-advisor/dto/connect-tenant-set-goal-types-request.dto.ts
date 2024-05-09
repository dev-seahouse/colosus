import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class ConnectTenantSetGoalTypesRequestDto {
  @ApiProperty({
    type: ['string'],
    example: [
      'fb371304-b9b3-430d-bdf9-8a1c19cc0b93',
      'c6c9b136-47e6-4f56-91c3-77595907a67b',
    ],
    description:
      'An array of UUIDs corresponding to the goal types offered by the tenant.',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  @IsArray()
  goalTypeIds: string[];
}
