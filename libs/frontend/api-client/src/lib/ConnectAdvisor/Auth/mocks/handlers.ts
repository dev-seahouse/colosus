import { rest } from 'msw';
import type {
  ConnectAdvisorCreateAccountRequestDto,
  ConnectAdvisorLoginRequestDto,
  ConnectAdvisorLoginResponseDto,
  ConnectAdvisorResendOtpRequestDto,
  ConnectAdvisorVerifyEmailRequestDto,
} from '../Auth';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor';

export const connectAdvisorAuthApiHandlers = [
  rest.post<ConnectAdvisorLoginRequestDto, any>(
    `${BASE_URL}/Login`,
    (req, res, ctx) => {
      if (req.body.username === 'invalid@bambu.co') {
        return res(ctx.status(401));
      } else if (req.body.username === 'unverified@bambu.co') {
        return res(ctx.status(409));
      }

      return res(
        ctx.status(200),
        ctx.json<ConnectAdvisorLoginResponseDto>({
          access_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsdGhRcl9tdS00Y1dnM0taX1NBcG5TRGtoNjVSTk1vR29oX2JQRk5NcXlrIn0.eyJleHAiOjE2NzgzNDc2MTksImlhdCI6MTY3ODM0NzMxOSwianRpIjoiYjFjMTViMGMtYWNmMy00NzRlLTk4MTUtNTc1YTU0NWZkYWU4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJzdWIiOiIyZTZlYTIyMy01ZmY1LTQ1MzYtYjMxMS1iZTRlZThkOGVlODYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiR3Vlc3QiXX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbIkd1ZXN0Il0sInByZWZlcnJlZF91c2VybmFtZSI6InB1YmxpY3VzZXIifQ.lVNcpgEUcgfn0KOjMjdpDplUeVvzbGBT_9H8BjfKTWbHg9koOsIKynVYttLSI1QdQ1iTjEYSoGxBQ-FlBTIEmF8COY3W0aVWfcsMurSkfoINA3A7VgwBKSfP9lsvX3Q5PYMHtCWcPEoo-ddJ7YIP_Syz2V6e1qPygofgBihMe4eYmC27u4oX98YhXoPJTfAaZNBiKA61dDvc99OTrgcAiqMh3Gr5xRGokWJKd41PLWnUpYxfmMvgMXyN0C5jQWAEweYGJ16E8oHebziePyZRQmG-1ymuSegzHv24Hn00G--UFqe6K_SG0KuTYT6iYCL3CBd9evsbeuEbIcK1uddv0A',
          expires_in: 300,
          refresh_expires_in: 1800,
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhOWJhYjAyNC1mYjA0LTRlNTYtYWMyYy1kOGJiMjEyODQ1Y2YifQ.eyJleHAiOjE2NzgzNDg4NjYsImlhdCI6MTY3ODM0NzA2NiwianRpIjoiYzdjNmQ1OTAtMWNjNS00YjUyLWE3ZjQtMzAzZTUzMDZiMzlkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2NvbG9zc3VzLXB1YmxpYyIsInN1YiI6IjJlNmVhMjIzLTVmZjUtNDUzNi1iMzExLWJlNGVlOGQ4ZWU4NiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSJ9.C3og1c2-Ren_9gvCC-TSjTOACLCIymuz38dgji4Htow',
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'Bearer',
        })
      );
    }
  ),
  rest.post<
    ConnectAdvisorCreateAccountRequestDto,
    any,
    ConnectAdvisorLoginResponseDto
  >(`${BASE_URL}`, (req, res, ctx) => {
    if (req.body.username === 'exists@bambu.co') {
      return res(ctx.status(409));
    }

    return res(
      ctx.status(200),
      ctx.json({
        access_token:
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsdGhRcl9tdS00Y1dnM0taX1NBcG5TRGtoNjVSTk1vR29oX2JQRk5NcXlrIn0.eyJleHAiOjE2NzgzNDc2MTksImlhdCI6MTY3ODM0NzMxOSwianRpIjoiYjFjMTViMGMtYWNmMy00NzRlLTk4MTUtNTc1YTU0NWZkYWU4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJzdWIiOiIyZTZlYTIyMy01ZmY1LTQ1MzYtYjMxMS1iZTRlZThkOGVlODYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiR3Vlc3QiXX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbIkd1ZXN0Il0sInByZWZlcnJlZF91c2VybmFtZSI6InB1YmxpY3VzZXIifQ.lVNcpgEUcgfn0KOjMjdpDplUeVvzbGBT_9H8BjfKTWbHg9koOsIKynVYttLSI1QdQ1iTjEYSoGxBQ-FlBTIEmF8COY3W0aVWfcsMurSkfoINA3A7VgwBKSfP9lsvX3Q5PYMHtCWcPEoo-ddJ7YIP_Syz2V6e1qPygofgBihMe4eYmC27u4oX98YhXoPJTfAaZNBiKA61dDvc99OTrgcAiqMh3Gr5xRGokWJKd41PLWnUpYxfmMvgMXyN0C5jQWAEweYGJ16E8oHebziePyZRQmG-1ymuSegzHv24Hn00G--UFqe6K_SG0KuTYT6iYCL3CBd9evsbeuEbIcK1uddv0A',
        expires_in: 300,
        refresh_expires_in: 1800,
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhOWJhYjAyNC1mYjA0LTRlNTYtYWMyYy1kOGJiMjEyODQ1Y2YifQ.eyJleHAiOjE2NzgzNDg4NjYsImlhdCI6MTY3ODM0NzA2NiwianRpIjoiYzdjNmQ1OTAtMWNjNS00YjUyLWE3ZjQtMzAzZTUzMDZiMzlkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2NvbG9zc3VzLXB1YmxpYyIsInN1YiI6IjJlNmVhMjIzLTVmZjUtNDUzNi1iMzExLWJlNGVlOGQ4ZWU4NiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSJ9.C3og1c2-Ren_9gvCC-TSjTOACLCIymuz38dgji4Htow',
        token_type: 'Bearer',
        'not-before-policy': 0,
        session_state: 'Bearer',
      })
    );
  }),
  rest.post<ConnectAdvisorVerifyEmailRequestDto>(
    `${BASE_URL}/verify-email-initial`,
    (req, res, ctx) => {
      return res(ctx.status(205));
    }
  ),
  rest.post<ConnectAdvisorResendOtpRequestDto>(
    `${BASE_URL}/initial-verification/resend-otp`,
    (req, res, ctx) => {
      return res(ctx.status(201));
    }
  ),
  rest.post(`${BASE_URL}/change-password/send-link`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.post(`${BASE_URL}/change-password`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
