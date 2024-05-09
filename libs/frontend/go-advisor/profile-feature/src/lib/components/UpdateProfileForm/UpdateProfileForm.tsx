import { useForm, FormProvider } from 'react-hook-form';
import { Grid, Form, Button, enqueueSnackbar } from '@bambu/react-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  useSelectProfileQuery,
  useSelectUpdateProfileDetailsQuery,
} from '@bambu/go-advisor-core';

import FirstNameField from '../FirstNameField/FirstNameField';
import LastNameField from '../LastNameField/LastNameField';
import JobTitleField from '../JobTitleField/JobTitleField';
import BusinessNameField from '../BusinessNameField/BusinessNameField';
import CountryOfResidenceSelect from '../CountryOfResidenceSelect/CountryOfResidenceSelect';
import RegionField from '../RegionField/RegionField';
import profileSchema from '../../schema/profile.schema';

import useUpdateProfileDetails from '../../hooks/useUpdateProfileDetails/useUpdateProfileDetails';

// for now both update and create profile forms use the same schema
export type UpdateProfileFormState = z.infer<typeof profileSchema>;

export function UpdateProfileForm() {
  const { data: defaultValues } = useSelectProfileQuery();
  const updateProfileDetailsQuery = useSelectUpdateProfileDetailsQuery();
  const methods = useForm<UpdateProfileFormState>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues,
  });
  const { mutate, isLoading } = useUpdateProfileDetails({
    onSuccess: async () => {
      await updateProfileDetailsQuery();
      enqueueSnackbar({
        variant: 'success',
        message: 'Profile updated successfully',
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
        id="update-profile-form"
        data-testid="update-profile-form"
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid spacing={3} container>
              <Grid item xs={12}>
                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <FirstNameField />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LastNameField />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <JobTitleField />
              </Grid>
              <Grid item xs={12}>
                <BusinessNameField />
              </Grid>
              <Grid item xs={12}>
                <CountryOfResidenceSelect />
              </Grid>
              <Grid item xs={12}>
                <RegionField />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              isLoading={isLoading}
              data-testid="update-profile-form-btn"
              type="submit"
            >
              Save changes
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormProvider>
  );
}

export default UpdateProfileForm;
