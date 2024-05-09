import { rest } from 'msw';
import type { ConnectInvestorGetAdvisorProfileResponseDto } from '../AdvisorProfile';

const BASE_URL =
  'http://localhost:9000/api/v1/connect/investor/advisor-profile';
export const connectInvestorAdvisorProfileApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorGetAdvisorProfileResponseDto>({
        canPerformTransactActions: true,
        advisorSubscriptionIds: 'CONNECT',
        advisorSubscriptionInPlace: true,
        jobTitle: 'Financial Planner',
        incomeThreshold: 100000,
        retireeSavingsThreshold: 100000,
        firstName: 'Matius',
        lastName: 'Ben Slayer',
        tenantRealm: 'matius_at_bambu_co',
        profileBioRichText:
          '<p>As a financial planner, my primary objective is to help my clients achieve clarity and peace of mind in achieving their financial goals. I prioritize investments that focus on generating income, followed by long-term growth, to help you build a solid financial foundation for your future.</p>',
        contactMeReasonsRichText:
          "<p><strong>Let's make it happe</strong>n.</p><p></p><p>Hi there, I'm Robert Henderson, CFP.</p><p>Let's work together to bridge the financial gap and achieve your goals.</p><ul><li><p>Offer diversified investment strategies to minimize risk and optimise the return.</p></li><li><p>Extensive tax planning knowledge to minimize your tax liability .</p></li></ul>",
      })
    );
  }),
];
