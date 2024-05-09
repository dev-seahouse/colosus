import type { Meta } from '@storybook/react';
import { Header } from './Header';
import { rest } from 'msw';

const Story: Meta<typeof Header> = {
  component: Header,
  title: 'Core/components/Header',
};
export default Story;

export const Primary = {
  args: {},
};

export const AuthenticatedInvestor = {
  args: {},
  parameters: {
    msw: [
      rest.get(
        'http://localhost:9000/api/v1/tenant/branding',
        (req, res, ctx) => {
          return res(
            ctx.status(201),
            ctx.json({
              logoUrl: null,
              brandColor: '#00876A',
              headerBgColor: '#fff',
              tradeName: 'Wealth Avenue',
            })
          );
        }
      ),
      rest.get(
        'http://localhost:9000/api/v1/transact/investor/authenticated/profile',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              test: 'something',
            })
          );
        }
      ),
    ],
  },
};
