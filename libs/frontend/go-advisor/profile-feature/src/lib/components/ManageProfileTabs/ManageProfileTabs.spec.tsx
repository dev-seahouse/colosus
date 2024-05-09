import { render, screen, userEvent } from '@bambu/react-test-utils';

import ManageProfileTabs from './ManageProfileTabs';

vi.mock('@harnessio/ff-react-client-sdk', async () => {
  const mod = await vi.importActual<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    typeof import('@harnessio/ff-react-client-sdk')
  >('@harnessio/ff-react-client-sdk');
  return {
    ...mod,
    useFeatureFlag: vi.fn().mockReturnValue(true),
  };
});

describe('ManageProfileTabs', () => {
  it('should be able to switch betwen tabs', async () => {
    render(<ManageProfileTabs />);

    const profilePanel = screen.getByRole('tabpanel', {
      name: /personal/i,
    });

    expect(profilePanel.hidden).toEqual(false);

    const clientExperienceTab = screen.getByRole('tab', {
      name: /robo-advisor setting/i,
    });

    await userEvent.click(clientExperienceTab);

    const clientExperiencePanel = screen.getByRole('tabpanel', {
      name: /robo-advisor setting/i,
    });

    expect(profilePanel.hidden).toEqual(true);
    expect(clientExperiencePanel.hidden).toEqual(false);
  });
});
