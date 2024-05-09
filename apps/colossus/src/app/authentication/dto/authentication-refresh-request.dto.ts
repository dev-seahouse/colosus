import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthenticationDto } from '@bambu/shared';

export class AuthenticationRefreshRequestDto
  implements AuthenticationDto.IAuthenticationRefreshRequestDto
{
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhOWJhYjAyNC1mYjA0LTRlNTYtYWMyYy1kOGJiMjEyODQ1Y2YifQ.eyJleHAiOjE2NzgzNDg4NjYsImlhdCI6MTY3ODM0NzA2NiwianRpIjoiYzdjNmQ1OTAtMWNjNS00YjUyLWE3ZjQtMzAzZTUzMDZiMzlkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2NvbG9zc3VzLXB1YmxpYyIsInN1YiI6IjJlNmVhMjIzLTVmZjUtNDUzNi1iMzExLWJlNGVlOGQ4ZWU4NiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSJ9.C3og1c2-Ren_9gvCC-TSjTOACLCIymuz38dgji4Htow',
    description: [
      'JWT representing the refresh token. The refresh token is used to obtain new access tokens and refresh tokens (?) when the current access token expires. TODO(endpoint for refreshing)',
      'The example token decodes to the following header and payload:\n',
      'Header:',
      `
    {
      "alg": "HS256",
      "typ": "JWT",
      "kid": "a9bab024-fb04-4e56-ac2c-d8bb212845cf"
    }
      `,
      'Payload:',
      `
    {
      "exp": 1678348866,
      "iat": 1678347066,
      "jti": "c7c6d590-1cc5-4b52-a7f4-303e5306b39d",
      "iss": "http://localhost:8080/realms/colossus-public",
      "aud": "http://localhost:8080/realms/colossus-public",
      "sub": "2e6ea223-5ff5-4536-b311-be4ee8d8ee86",
      "typ": "Refresh",
      "azp": "account",
      "session_state": "51fc3d8d-9e54-44d6-b229-a18278ffc1b1",
      "scope": "email profile",
      "sid": "51fc3d8d-9e54-44d6-b229-a18278ffc1b1"
    }
      `,
    ].join('\n'),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
