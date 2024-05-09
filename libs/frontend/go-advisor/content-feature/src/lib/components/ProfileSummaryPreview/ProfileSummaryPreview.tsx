import { GoAppPreviewCard, GoAppPreviewOverlay } from '@bambu/go-advisor-core';
import {
  AdvisorProfile,
  ContactAdvisor,
} from '@bambu/go-goal-settings-feature';
import { useSelectUpdateAdvisorProfileQuery } from '@bambu/go-core';
import { useFormContext } from 'react-hook-form';
import { useEffect, useRef, useCallback } from 'react';

import type { ProfileSummaryFormState } from '../ProfileSummaryForm/ProfileSummaryForm';

export function ProfileSummaryPreview() {
  const { watch } = useFormContext<ProfileSummaryFormState>();
  const content = watch('richText');
  const fullProfileLink = watch('fullProfileLink');
  const updateAdvisorProfile = useSelectUpdateAdvisorProfileQuery();
  const handleUpdateAdvisorProfile = useCallback(updateAdvisorProfile, [
    updateAdvisorProfile,
  ]);
  const initialRender = useRef(true);

  useEffect(() => {
    if (!initialRender.current) {
      handleUpdateAdvisorProfile({
        profileBioRichText: content,
        fullProfileLink: fullProfileLink,
      });
    }

    initialRender.current = false;
  }, [content, fullProfileLink, handleUpdateAdvisorProfile]);

  return (
    <GoAppPreviewCard>
      <GoAppPreviewOverlay>
        <ContactAdvisor />
      </GoAppPreviewOverlay>
      <AdvisorProfile />
    </GoAppPreviewCard>
  );
}

export default ProfileSummaryPreview;
