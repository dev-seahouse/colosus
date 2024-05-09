import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

import { server } from './src/mocks/server';

// enables matchers such as 'expect().toBeInTheDocument()'
expect.extend(matchers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
