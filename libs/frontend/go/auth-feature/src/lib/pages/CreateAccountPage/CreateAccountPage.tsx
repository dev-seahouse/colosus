import { LayoutWithProgress } from '@bambu/go-core';
import CreateAccountForm from '../../components/CreateAccountForm/CreateAccountForm';

export function CreateAccountPage() {
  return (
    <LayoutWithProgress>
      <CreateAccountForm />
    </LayoutWithProgress>
  );
}

export default CreateAccountPage;
