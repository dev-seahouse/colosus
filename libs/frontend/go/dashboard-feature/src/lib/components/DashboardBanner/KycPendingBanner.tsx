import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';

export function KycPendingBanner({ name }: { name: string }) {
  return (
    <DashboardBannerLayout
      title={`Well done, ${name}`}
      description={
        'We are reviewing your KYC. It’ll take 3 days before you can start investing. '
      }
    />
  );
}
export default KycPendingBanner;
