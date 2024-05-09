import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';

export function DirectDebitInProgressBanner() {
  return (
    <DashboardBannerLayout
      title={'Direct Debit setup is in progress'}
      description={
        'We are setting up your Direct Debit and will notify you once is ready'
      }
    />
  );
}

export default DirectDebitInProgressBanner;
