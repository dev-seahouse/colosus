import { Stack, Box, Button, Form, BackButton } from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSelectUpdateProfileDetailsQuery,
  useSelectProfileQuery,
} from '@bambu/go-advisor-core';

import Heading from '../Heading/Heading';
import PersonalDetailsFields from '../PersonalDetailsFields/PersonalDetailsFields';
import BusinessDetailsFields from '../BusinessDetailsFields/BusinessDetailsFields';
import useUpdateProfileDetails from '../../hooks/useUpdateProfileDetails/useUpdateProfileDetails';

import profileSchema from '../../schema/profile.schema';

// for now both update and create profile forms use the same schema
export type ProfileFormState = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: defaultValues } = useSelectProfileQuery();
  const methods = useForm<ProfileFormState>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues,
  });
  const updateProfileDetailsQuery = useSelectUpdateProfileDetailsQuery();
  const navigate = useNavigate();
  const { mutate, isLoading } = useUpdateProfileDetails({
    onSuccess: async () => {
      await updateProfileDetailsQuery();
      navigate('../setup-platform');
    },
  });
  const onSubmit = methods.handleSubmit((data) => {
    mutate(data);
  });

  return (
    <FormProvider {...methods}>
      <Form onSubmit={onSubmit} id="profile-form" data-testid="profile-form">
        <Stack spacing={7}>
          <Stack spacing={4}>
            <Box sx={{ left: 0 }}>
              <BackButton />
            </Box>
            <Heading title="Tell us about yourself and your business" />
            <Box>
              <PersonalDetailsFields />
            </Box>
            <Box>
              <BusinessDetailsFields />
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              isLoading={isLoading}
              type="submit"
              data-testid="profile-form-btn"
            >
              Next
            </Button>
          </Box>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default ProfileForm;
