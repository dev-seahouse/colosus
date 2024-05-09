import type { ImageFile } from '@bambu/react-ui';
import {
  Button,
  closeSnackbar,
  enqueueSnackbar,
  Form,
  Grid,
  MuiLink,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import {
  UnsavedChangeDialog,
  useSelectRefreshTenantBrandingDataQuery,
  useSelectTenantBrandingQuery,
  useSelectUpdateTenantBrandingDataQuery,
} from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import HeaderBranding from '../HeaderBranding/HeaderBranding';
import ColorThemeBranding from '../ColorThemeBranding/ColorThemeBranding';
import BrandingPreview from '../BrandingPreview/BrandingPreview';
import useUpdateBranding from '../../hooks/useUpdateBranding/useUpdateBranding';
import useUploadLogo from '../../hooks/useUploadLogo/useUploadLogo';
import useDeleteLogo from '../../hooks/useDeleteLogo/useDeleteLogo';
import {
  getBrandingDefaultValues,
  hasLogoChanged,
  isNewLogo,
} from './BrandingForm.utils';
import { z } from 'zod';

// TODO: something is just not right at the moment, improve later
const brandingFormSchema = z.object({
  tradeName: z
    .string()
    .min(1, 'The name of your brand is required')
    .max(20, 'Your robo-advisor name exceeds 20 characters'),
  brandColor: z.string().optional(),
  headerBgColor: z.string().optional(),
  logo: z.any().optional(),
});

export type BrandingFormValidationSchema = z.infer<typeof brandingFormSchema>;

export interface BrandingFormState extends BrandingFormValidationSchema {
  logo: null | ImageFile;
  brandColor: string;
  headerBgColor: string;
}

export function BrandingForm() {
  const { data: tenantBranding } = useSelectTenantBrandingQuery();
  const updateTenantBrandingData = useSelectUpdateTenantBrandingDataQuery();
  const refreshTenantBrandingData = useSelectRefreshTenantBrandingDataQuery();
  const methods = useForm<BrandingFormState>({
    values: getBrandingDefaultValues(tenantBranding),
    mode: 'onTouched',
    resolver: zodResolver(brandingFormSchema),
  });
  const { reset } = methods;
  const handleReset = useCallback(
    () => reset(getBrandingDefaultValues(tenantBranding)),
    [reset]
  );
  const navigate = useNavigate();
  const initialRender = useRef(true);

  const { mutate: updateBranding, isLoading: isUpdatingBranding } =
    useUpdateBranding({
      onSuccess: async () => {
        const { brandColor, headerBgColor, tradeName } = methods.getValues();

        updateTenantBrandingData({
          brandColor,
          headerBgColor,
          tradeName,
        });

        enqueueSnackbar({
          variant: 'success',
          message: 'Branding configuration saved!',
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

        await refreshTenantBrandingData();
      },
    });
  const { mutateAsync: uploadLogo, isLoading: isUploadingLogo } = useUploadLogo(
    {
      // refresh branding data after logo is uploaded instead of updating it, because we can't use logo stored in browser memory
      onSuccess: () => refreshTenantBrandingData(),
    }
  );
  const { mutateAsync: deleteLogo, isLoading: isDeletingLogo } = useDeleteLogo({
    onSuccess: () => refreshTenantBrandingData(),
  });

  const onSubmit = methods.handleSubmit(async (formData) => {
    const { brandColor, headerBgColor, tradeName, logo } = formData;
    const originalValues = methods.formState.defaultValues as BrandingFormState;

    // if logo has changed
    if (hasLogoChanged(originalValues.logo, logo)) {
      // if user uploads new logo
      if (isNewLogo(originalValues.logo, logo)) {
        if (logo?.formData) {
          await uploadLogo(logo.formData);
        }
        //   else, the user has just removed the logo so delete it
      } else {
        await deleteLogo();
      }
    }

    updateBranding({ brandColor, headerBgColor, tradeName });
  });

  useEffect(() => {
    if (!initialRender.current) {
      handleReset();
    }
    initialRender.current = false;
  }, [handleReset]);

  return (
    <>
      <FormProvider {...methods}>
        <Form
          id="branding-form"
          data-testid="branding-form"
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <HeaderBranding />
                </Grid>
                <Grid item xs={12}>
                  <ColorThemeBranding />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    isLoading={
                      isUpdatingBranding || isUploadingLogo || isDeletingLogo
                    }
                    type="submit"
                  >
                    Use this configuration
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <BrandingPreview />
            </Grid>
          </Grid>
        </Form>
      </FormProvider>
      <UnsavedChangeDialog when={methods.formState.isDirty} />
    </>
  );
}

export default BrandingForm;
