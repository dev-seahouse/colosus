import {
  Box,
  Button,
  Form,
  Stack,
  Grid,
  MuiLink,
  closeSnackbar,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ConfigureGoalsDataGrid from '../ConfigureGoalsDataGrid/ConfigureGoalsDataGrid';
import useGetGoalsConfiguration from '../../hooks/useGetGoalsConfiguration/useGetGoalsConfiguration';
import useSetGoalsConfiguration from '../../hooks/useSetGoalsConfiguration/useSetGoalsConfiguration';
import { enqueueSnackbar } from 'notistack';
import ConfigureGoalsPreview from '../ConfigureGoalsPreview/ConfigureGoalsPreview';
import initialGoalConfigData from '../../initialGoalConfigData';
import type { ConfigureGoalsFormFields } from '../../sharedTypes';
import { UnsavedChangeDialog } from '@bambu/go-advisor-core';

/**
 * initialGoalConfig will be used as placeholder during
 * api state transition + react-query cache expired
 */

export function ConfigureGoalsForm() {
  const { data } = useGetGoalsConfiguration({
    initialData: {
      ...initialGoalConfigData,
    },
  });
  const { mutate } = useSetGoalsConfiguration();
  const navigate = useNavigate();

  if (data === undefined)
    throw new Error(
      'Data would never be undefined because initialData has been provided.'
    );

  const methods = useForm<ConfigureGoalsFormFields>({
    values: {
      goalTypes: data,
    },
  });

  const onSubmit = ({ goalTypes }: ConfigureGoalsFormFields) => {
    const onlyEnabledAndOtherGoal = (goal: {
      enabled: boolean;
      name: string;
    }) => goal.enabled || goal.name === 'Other';
    const onlyGoalId = (goal: { id: string }) => goal.id;

    mutate(goalTypes.filter(onlyEnabledAndOtherGoal).map(onlyGoalId), {
      onSuccess: () => {
        // pending snackbar component
        enqueueSnackbar({
          message: 'Goal configuration saved',
          variant: 'success',
          // need to use useNavigate because notistack provider is not within routerprovider
          action: (snackbarId) => (
            <>
              <MuiLink
                component="button"
                onClick={() => {
                  closeSnackbar(snackbarId);
                  navigate('../home');
                }}
              >
                Go to dashboard
              </MuiLink>
              <SnackbarCloseButton snackbarKey={snackbarId} />
            </>
          ),
        });
      },
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={4}>
                <ConfigureGoalsDataGrid />
                <Box>
                  <Button type="submit">Use this configuration</Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <ConfigureGoalsPreview />
            </Grid>
          </Grid>
        </Form>
      </FormProvider>
      <UnsavedChangeDialog when={methods.formState.isDirty} />
    </>
  );
}

export default ConfigureGoalsForm;
