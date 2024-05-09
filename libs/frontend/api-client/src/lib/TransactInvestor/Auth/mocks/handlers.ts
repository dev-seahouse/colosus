import { rest } from 'msw';
import type {
  TransactInvestorLoginRequestDto,
  TransactInvestorLoginResponseDto,
  TransactInvestorCreateAccountRequestDto,
  TransactInvestorValidateAccountRequestDto,
} from '../Auth';

const BASE_URL = 'http://localhost:9000/api/v1/transact/investor';

export const transactInvestorAuthApiHandlers = [
  rest.post<TransactInvestorLoginRequestDto, any>(
    `${BASE_URL}/Login`,
    (req, res, ctx) => {
      if (req.body.username === 'invalid@bambu.co') {
        return res(ctx.status(401));
      } else if (req.body.username === 'unverified@bambu.co') {
        return res(ctx.status(409));
      }

      return res(
        ctx.status(200),
        ctx.json<TransactInvestorLoginResponseDto>({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImQ2YmRlNTRmOCJ9.eyJhdWQiOiJhZDI3OTlmMC00NTZjLTQ4YmEtYWFlOS02ZTQ1OWU4YjNjNjQiLCJleHAiOjE2OTc2MjMxNjQsImlhdCI6MTY5NzYyMjg2NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiJkOTI3ZmVjZS1hZDUzLTRjOGItOTc2OS1hNDc4Y2M3NWVhNDciLCJqdGkiOiI5NjIwODU0Mi1lNTg5LTQxOWUtOTRlMy1iYjcyZDgxMjllYmEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiaWFuK3Rlc3QwMUBiYW1idS5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiaWFuK3Rlc3QwMUBiYW1idS5jbyIsImFwcGxpY2F0aW9uSWQiOiJhZDI3OTlmMC00NTZjLTQ4YmEtYWFlOS02ZTQ1OWU4YjNjNjQiLCJyb2xlcyI6WyJJbnZlc3RvciJdLCJzaWQiOiI5Y2RhODM3Yy02NzZhLTQxOWQtOWM0OC1jMGI0OTQ0MzAxNWMiLCJhdXRoX3RpbWUiOjE2OTc2MjI4NjQsInRpZCI6ImJiNDBmMzEyLTI1ZWMtNGQxYi05ZmU3LTg5YTVmOTZjNzgyYyJ9.PBT6W-uFZQ2E14J5f8V2VHSdJahUNTOBgV8xU0O1x8k',
          expires_in: 300,
          refresh_expires_in: 86400,
          refresh_token:
            'FMtfbW_6fiy1MAg6FnQKOTmOQ3CMQJiZk12-BHi7A1eVUNTLF1McTA',
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'Bearer',
        })
      );
    }
  ),
  rest.post<TransactInvestorCreateAccountRequestDto, any>(
    `${BASE_URL}/convert-to-platform-user`,
    (req, res, ctx) => {
      if (req.body.email === 'exists@bambu.co') {
        return res(ctx.status(409));
      }

      return res(ctx.status(201), ctx.json({ data: '' }));
    }
  ),
  rest.post<TransactInvestorValidateAccountRequestDto>(
    `${BASE_URL}/validate-conversion-otp`,
    (req, res, ctx) => {
      return res(ctx.status(205));
    }
  ),
];
