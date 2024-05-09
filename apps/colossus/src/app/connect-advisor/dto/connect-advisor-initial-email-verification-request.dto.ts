import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectAdvisorAccountInitialEmailVerificationRequestDto
  implements
    ConnectAdvisorDto.IConnectAdvisorAccountInitialEmailVerificationRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description:
      'The username of the user. For advisors on Connect, this is the email address.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({
    type: 'string',
    example: '902832',
    description: "The OTP sent to the user's email.",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhOWJhYjAyNC1mYjA0LTRlNTYtYWMyYy1kOGJiMjEyODQ1Y2YifQ.eyJleHAiOjE2NzgzNDg4NjYsImlhdCI6MTY3ODM0NzA2NiwianRpIjoiYzdjNmQ1OTAtMWNjNS00YjUyLWE3ZjQtMzAzZTUzMDZiMzlkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2NvbG9zc3VzLXB1YmxpYyIsInN1YiI6IjJlNmVhMjIzLTVmZjUtNDUzNi1iMzExLWJlNGVlOGQ4ZWU4NiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSJ9.C3og1c2-Ren_9gvCC-TSjTOACLCIymuz38dgji4Htow',
    description:
      'Optional JWT representing the refresh token. If provided, the response will include an IAuthenticationLoginResponseDto object.',
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
