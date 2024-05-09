import { rest } from 'msw';

import type {
  ConnectAdvisorGetProfileResponseDto,
  ConnectAdvisorUpdateProfileRequestDto,
  ConnectAdvisorUpdateProfileResponseDto,
} from '../Profile';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/profile';

export const connectAdvisorProfileApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetProfileResponseDto>({
        username: 'foo.eggs@bar.com',
        userId: '51007cd5-2a5f-4507-aa67-a2bf6994c023',
        emailVerified: true,
        advisorSubscriptionIds: 'CONNECT',
        tenantRealm: 'foo_eggs_at_bar_com',
        firstName: 'Ashley',
        lastName: 'Smith',
        jobTitle: 'Financial Advisor',
        countryOfResidence: 'USA',
        businessName: 'Gre@t Adv1sor Pte Ltd',
        region: 'Detroit',
        hasActiveSubscription: true,
        contactMeReasonsRichText: '<p>I am awesome!</p>',
        profileBioRichText: '<p>I am a professional money maker</p>',
        subdomain: 'https://bambu.bambu-go.com',
      })
    );
  }),
  rest.patch<
    ConnectAdvisorUpdateProfileRequestDto,
    any,
    ConnectAdvisorUpdateProfileResponseDto
  >(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(204), ctx.body(''));
  }),
  rest.post(`${BASE_URL}/picture/public`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(`${BASE_URL}/picture/public`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.post(`${BASE_URL}/picture/internal`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(`${BASE_URL}/picture/internal`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
