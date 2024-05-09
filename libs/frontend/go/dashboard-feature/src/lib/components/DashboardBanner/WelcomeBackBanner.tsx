import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';
import OpenInvestAccountButton from '../OpenInvestAccountButton/OpenInvestAccountButton';

export function WelcomeBackBanner({ name }: { name: string }) {
  return (
    <DashboardBannerLayout
      title={'Welcome back, ' + name}
      description={'Next, let’s turn your dream into a reality.'}
      action={<OpenInvestAccountButton />}
    />
  );
}

export default WelcomeBackBanner;
