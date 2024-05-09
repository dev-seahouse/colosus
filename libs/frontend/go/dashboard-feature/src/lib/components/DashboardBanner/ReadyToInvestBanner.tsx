import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';

export function ReadyToInvestBanner() {
  return (
    <DashboardBannerLayout
      title={'You’re all set!'}
      description={
        "Your direct debit is all set up. To begin funding your goal, just click the 'Fund my goal' button on the goal card and get started."
      }
    />
  );
}

export default ReadyToInvestBanner;
