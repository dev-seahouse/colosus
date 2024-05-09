import { Stack, Box, Button, Form, enqueueSnackbar } from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSelectUpdateTenantBrandingDataQuery,
  useSelectSubdomainQuery,
  useSelectTenantTradeNameQuery,
} from '@bambu/go-advisor-core';

import BrandFields from '../BrandFields/BrandFields';
import ClientExperienceFields from '../ClientExperienceFields/ClientExperienceFields';
import useUpdateTradeNameAndSubdomain from '../../hooks/useUpdateTradeNameAndSubdomain/useUpdateTradeNameAndSubdomain';
import { platformSetupFormSchema } from '../../schema/platform.schema';

export type UpdatePlatformSetupFormState = z.infer<
  typeof platformSetupFormSchema
>;

export function UpdatePlatformSetupForm() {
  const { data: subdomain } = useSelectSubdomainQuery();
  const { data: tradeName } = useSelectTenantTradeNameQuery();
  const methods = useForm<UpdatePlatformSetupFormState>({
    resolver: zodResolver(platformSetupFormSchema),
    mode: 'onTouched',
    defaultValues: {
      tradeName,
      subdomain: subdomain as string,
    },
  });
  const updateTenantBrandingData = useSelectUpdateTenantBrandingDataQuery();
  const { mutate, isLoading } = useUpdateTradeNameAndSubdomain({
    onSuccess: () => {
      const tradeName = methods.getValues('tradeName');

      updateTenantBrandingData({ tradeName });
      enqueueSnackbar({
        variant: 'success',
        message: 'Your changes have been saved.',
      });
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    mutate(data);
  });

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={onSubmit}
        id="update-platform-setup-form"
        data-testid="update-platform-setup-form"
      >
        <Stack spacing={7}>
          <Stack spacing={4}>
            <BrandFields />
            <ClientExperienceFields disabled />
          </Stack>
          <Box>
            <Button
              isLoading={isLoading}
              type="submit"
              data-testid="platform-setup-form-btn"
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default UpdatePlatformSetupForm;
