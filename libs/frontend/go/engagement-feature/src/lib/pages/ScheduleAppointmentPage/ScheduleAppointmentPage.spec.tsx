import { render, screen } from '@bambu/react-test-utils';

import ScheduleAppointmentPage from './ScheduleAppointmentPage';

describe('ScheduleAppointmentPage', () => {
  beforeAll(() => {
    vi.mock('@bambu/go-core', async () => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      const mod = await vi.importActual<typeof import('@bambu/go-core')>(
        '@bambu/go-core'
      );
      return {
        ...mod,
        useSelectAdvisorHasContactLink: vi
          .fn()
          .mockReturnValueOnce({ data: false })
          .mockReturnValueOnce({ data: true }),
        useSelectRiskProfileId: vi
          .fn()
          .mockReturnValue('38ae4560-7dcc-487a-88d6-4bd983d6da00'),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  beforeEach(() => {
    render(<ScheduleAppointmentPage />);
  });

  it('should render ScheduleAppointmentForm if advisor does not have contact link', async () => {
    expect(
      await screen.findByTestId('schedule-appointment-form')
    ).toBeDefined();
  });

  it('should render ScheduleAppointmentWithLinkForm if advisor has contact link', async () => {
    expect(
      await screen.findByTestId('schedule-appointment-with-link-form')
    ).toBeDefined();
  });
});
