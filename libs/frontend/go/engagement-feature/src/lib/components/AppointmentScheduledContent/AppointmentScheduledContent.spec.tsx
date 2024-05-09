import { render, screen } from '@bambu/react-test-utils';

import AppointmentScheduledContent from './AppointmentScheduledContent';
import { beforeEach } from 'vitest';

vi.mock('@bambu/go-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-core')>(
    '@bambu/go-core'
  );
  return {
    ...mod,
    useSelectAdvisorHasContactLink: vi
      .fn()
      .mockReturnValueOnce({ data: true })
      .mockReturnValueOnce({ data: false }),
  };
});

describe('AppointmentScheduledContent', () => {
  beforeEach(() => {
    render(<AppointmentScheduledContent />, {
      path: '/appointment-scheduled?email=true',
    });
  });

  it('should display appointment scheduled with link message if advisor has contact link', () => {
    expect(screen.getByTestId('appointment-scheduled-with-link')).toBeDefined();
  });

  it('should display appointment scheduled message if advisor does not have contact link', () => {
    expect(
      screen.getByTestId('appointment-scheduled-without-link')
    ).toBeDefined();
  });
});
