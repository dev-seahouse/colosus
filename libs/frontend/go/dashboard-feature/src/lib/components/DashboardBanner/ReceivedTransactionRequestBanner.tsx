import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';

export function ReceivedTransactionRequestBanner({ name }: { name: string }) {
  return (
    <DashboardBannerLayout
      title={'Well done, ' + name}
      description={
        'We received your transaction request. The transaction process will take around 1-3 days.'
      }
    />
  );
}

export default ReceivedTransactionRequestBanner;
