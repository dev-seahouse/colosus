import {
  Box,
  Button,
  enqueueSnackbar,
  Form,
  Grid,
  Stack,
} from '@bambu/react-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { UnsavedChangeDialog } from '@bambu/go-advisor-core';

import type { ConfigurePortfolioFormState } from './ConfigurePortfolioForm.types';
import { getPortfolioDetailsSchema } from './ConfigurePortolioform.schema';
import type { PropsWithChildren } from 'react';
import { SkeletonLoading } from '@bambu/go-core';
import { composeTransactPortfolioPayload } from './ConfigurePortfolioform.utils';
import EditMoreOrBackSnackBar from '../EditMoreOrBackSnackBar/EditMoreOrBackSnackBar';
import type {
  TransactCreateModePortfolioInstrumentsResponseDto,
  TransactModelPortfolioSummaryDto,
} from '@bambu/api-client';
import { useConfigurePortfolioFormData } from './hooks/useConfigurePortfolioFormData/useConfigurePortfolioFormData';
import { useConfigurePortfolioFormMutations } from './hooks/useConfigurePortfolioMutations/useConfigurePortfolioMutations';
import { useSelectInvalidateConnectPortfolioByKey } from '../../hooks/useGetConnectPortfolioByKey/useGetConnectPortfolioByKey.selectors';
import { useQueryClient } from '@tanstack/react-query';

export function ConfigurePortfolioForm({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { portfolioType } = useParams();
  const queryClient = useQueryClient();

  const {
    connectPortfolioSummary,
    isConnectPortfolioLoading,
    isConnectPortfolioError,
    isReadyToConfigureTransactPortfolio,
    isReadyToConfigureTransactPortfolioLoading,
    isReadyToConfigureTransactPortfolioError,
    isTransactPortfolioLoading,
    transactPortfolioInitialData,
    isTransactPortfolioInitialDataError,
  } = useConfigurePortfolioFormData(portfolioType);
  const {
    updateConnectPortfolio,
    isUpdatingConnectPortfolio,
    createTransactModelPortfolio,
    isCreatingTransactPortfolio,
    createTransactPortfolioInstruments,
    isCreatingTransactPortfolioInstruments,
    uploadTransactPortfolioFactSheet,
    isUploadingTransactPortfolioFactSheet,
  } = useConfigurePortfolioFormMutations();

  const connectModelPortfolioSummaryId = connectPortfolioSummary?.id;

  const invalidatePortfolioByKey = useSelectInvalidateConnectPortfolioByKey(
    portfolioType as string
  );

  const methods = useForm<ConfigurePortfolioFormState>({
    resolver: zodResolver(
      getPortfolioDetailsSchema({
        isTransact: !!isReadyToConfigureTransactPortfolio,
      })
    ),
    values: {
      ...(connectPortfolioSummary as ConfigurePortfolioFormState),
      ...(isReadyToConfigureTransactPortfolio && transactPortfolioInitialData),
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: ConfigurePortfolioFormState) => {
    updateConnectPortfolio(data, {
      onSuccess: onCreateConnectModelPortfolioSuccess,
    });

    if (isReadyToConfigureTransactPortfolio) {
      upsertTransactPortfolioAssetAllocation(data);
    }
  };

  function onCreateConnectModelPortfolioSuccess() {
    if (!isReadyToConfigureTransactPortfolio) {
      showSnackBar();
    }
    invalidatePortfolioByKey();
  }

  /**
   *  create or update exising transact portfolio
   *  as well as its instruments and fact sheet
   */
  function upsertTransactPortfolioAssetAllocation(
    formData: ConfigurePortfolioFormState
  ) {
    const transactPortfolioPayload = composeTransactPortfolioPayload({
      formData: formData,
      connectPortfolioId: connectModelPortfolioSummaryId ?? '',
    });

    if (transactPortfolioPayload.success) {
      createTransactModelPortfolio(transactPortfolioPayload.data, {
        onSuccess: onCreateTransactPortfolioSuccess(formData),
      });
    }
  }

  function onCreateTransactPortfolioSuccess(
    formData: ConfigurePortfolioFormState
  ) {
    return async (res: TransactModelPortfolioSummaryDto) => {
      upsertTransactModelPortfolioInstruments(formData, res);
      uploadTransactModelPortfolioFactSheet(res, formData);
      showSnackBar();
    };
  }

  function upsertTransactModelPortfolioInstruments(
    formData: ConfigurePortfolioFormState,
    res: TransactModelPortfolioSummaryDto
  ) {
    createTransactPortfolioInstruments(
      formData.transact.instruments.map((i) => ({
        instrumentId: i.instrumentId,
        weightage: i.weightage ? i.weightage / 100 : 0,
        transactModelPortfolioId: res.id,
      })),
      {
        onSuccess: onUpsertTransactModelPortfolioInstrumentsSuccess,
      }
    );
  }

  async function onUpsertTransactModelPortfolioInstrumentsSuccess(
    data: TransactCreateModePortfolioInstrumentsResponseDto
  ) {
    queryClient.setQueryData(['getTransactModelPortfolios'], (oldData) =>
      oldData
        ? {
            ...oldData,
            TransactModelPortfolioInstruments: {
              ...data,
            },
          }
        : oldData
    );
    return await queryClient.invalidateQueries(['getTransactModelPortfolios']);
  }

  function uploadTransactModelPortfolioFactSheet(
    res: TransactModelPortfolioSummaryDto,
    formData: ConfigurePortfolioFormState
  ) {
    // for existing users who have uploaded fact sheet before, in such case they have url but not formData
    if (
      formData.transact.factSheet?.formData === undefined &&
      formData.transact.factSheet?.url.length
    )
      return;
    uploadTransactPortfolioFactSheet(
      {
        id: res.id,
        file: formData.transact.factSheet?.formData as FormData,
      },
      {
        onSettled: async () =>
          await queryClient.invalidateQueries(['getTransactModelPortfolios']),
      }
    );
  }

  function showSnackBar() {
    enqueueSnackbar({
      message: 'Portfolio updated successfully',
      variant: 'success',
      action: (snackbarId) => (
        <EditMoreOrBackSnackBar snackbarId={snackbarId} navigate={navigate} />
      ),
    });
  }

  if (
    isTransactPortfolioLoading ||
    isConnectPortfolioLoading ||
    isReadyToConfigureTransactPortfolioLoading
  ) {
    return <SkeletonLoading />;
  }

  return (
    <>
      <FormProvider {...methods}>
        <Form
          id="configure-portfolio-form"
          data-testid="configure-portfolio-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={4}>
                {children}
                <Box>
                  <Button
                    type="submit"
                    data-testid="update-portfolio-btn"
                    disabled={
                      isConnectPortfolioLoading ||
                      isReadyToConfigureTransactPortfolioLoading ||
                      isConnectPortfolioError ||
                      isTransactPortfolioInitialDataError ||
                      isReadyToConfigureTransactPortfolioError ||
                      isUpdatingConnectPortfolio ||
                      isCreatingTransactPortfolio ||
                      isCreatingTransactPortfolioInstruments ||
                      isUploadingTransactPortfolioFactSheet
                    }
                    isLoading={
                      isUpdatingConnectPortfolio ||
                      isCreatingTransactPortfolio ||
                      isCreatingTransactPortfolioInstruments ||
                      isUploadingTransactPortfolioFactSheet
                    }
                  >
                    Use this configuration
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormProvider>
      <UnsavedChangeDialog
        when={methods.formState.isDirty && !methods.formState.isSubmitted}
      />
    </>
  );
}

export default ConfigurePortfolioForm;
