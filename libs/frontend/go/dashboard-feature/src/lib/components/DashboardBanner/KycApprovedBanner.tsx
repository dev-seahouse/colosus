import { useNavigate } from 'react-router-dom';
import DashboardBannerLayout from '../../layouts/DashboardBannerLayout/DashboardBannerLayout';
import { Button } from '@bambu/react-ui';

export function KycApprovedBanner({ name }: { name: string }) {
  const navigate = useNavigate();
  const handleSetDirectDebit = () => {
    navigate('/direct-debit-mandate-setup');
  };

  return (
    <DashboardBannerLayout
      title={'Congratulation, ' + name}
      description={
        "Your investment account is approved. Now, let's proceed to set up your Direct Debit mandate."
      }
      action={
        <Button onClick={handleSetDirectDebit}>Set up Direct Debit</Button>
      }
    />
  );
}
export default KycApprovedBanner;
