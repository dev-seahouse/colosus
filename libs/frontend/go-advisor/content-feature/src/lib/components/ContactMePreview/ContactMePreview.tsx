import {
  GoAppPreviewCard,
  GoAppPreviewOverlay,
  useSelectAdvisorPublicProfilePictureQuery,
} from '@bambu/go-advisor-core';
import { ContactAdvisor } from '@bambu/go-goal-settings-feature';
import { useSelectUpdateAdvisorProfileQuery } from '@bambu/go-core';
import { useFormContext } from 'react-hook-form';
import type { ContactMeFormState } from '../ContactMeForm/ContactMeForm';
import { useEffect, useRef, useCallback } from 'react';
import type { GetOptimizedProjectionData } from '@bambu/go-goal-settings-feature';

export function ContactMePreview() {
  const { watch } = useFormContext<ContactMeFormState>();
  const content = watch('richText');
  const updateAdvisorProfile = useSelectUpdateAdvisorProfileQuery();
  const handleUpdateAdvisorProfile = useCallback(updateAdvisorProfile, [
    updateAdvisorProfile,
  ]);
  const initialRender = useRef(true);
  const { data: currentProfilePicture } =
    useSelectAdvisorPublicProfilePictureQuery();

  useEffect(() => {
    if (!initialRender.current) {
      handleUpdateAdvisorProfile({
        contactMeReasonsRichText: content,
        advisorProfilePictureUrl: currentProfilePicture,
      });
    }

    initialRender.current = false;
  }, [content, currentProfilePicture, handleUpdateAdvisorProfile]);

  return (
    <GoAppPreviewCard>
      <GoAppPreviewOverlay />
      <ContactAdvisor initialData={{} as GetOptimizedProjectionData} />
    </GoAppPreviewCard>
  );
}

export default ContactMePreview;
