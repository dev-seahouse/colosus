import { LayoutWithProgress } from '@bambu/go-core';
import VerifyAccountForm from '../../components/VerifyAccountForm/VerifyAccountForm';

export function VerifyAccountPage() {
  return (
    <LayoutWithProgress>
      <VerifyAccountForm />
    </LayoutWithProgress>
  );
}

export default VerifyAccountPage;
