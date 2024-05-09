import { setupServer } from 'msw/node';
import { handlers } from '@bambu/api-client';

export const server = setupServer(...handlers);
