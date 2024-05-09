import { useEffect } from 'react';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import { useSelectResetLayoutState } from '../../store/useProfileCreationStore.selectors';

export function AdvisorDetailsPage() {
  const resetLayoutState = useSelectResetLayoutState();

  useEffect(() => {
    resetLayoutState();
  }, [resetLayoutState]);

  return <ProfileForm />;
}

export default AdvisorDetailsPage;
