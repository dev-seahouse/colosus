import { useNavigate } from 'react-router-dom';

import {
  useSelectPrivacyPolicyDocumentExistsQuery,
  useSelectRefreshGetUploadedDocumentQuery,
  useSelectTermsAndConditionsDocumentUrlQuery,
} from '@bambu/go-advisor-core';
import {
  Box,
  closeSnackbar,
  enqueueSnackbar,
  FileUpload,
  MuiLink,
  SnackbarCloseButton,
  Stack,
  Typography,
} from '@bambu/react-ui';

import useUploadDocument from '../../hooks/useUploadDocument/useUploadDocument';
import FileUploadSection from '../FileUploadSection/FileUploadSection';
import FileUploadSectionTitle from '../FileUploadSectionTitle/FileUploadSectionTitle';

export function TermsAndConditionsFileUpload() {
  const { data: termsAndConditionsUrl = '' } =
    useSelectTermsAndConditionsDocumentUrlQuery();
  const { data: privacyPolicyDocumentExists } =
    useSelectPrivacyPolicyDocumentExistsQuery();
  const navigate = useNavigate();
  const refresh = useSelectRefreshGetUploadedDocumentQuery();
  const { mutate, isLoading } = useUploadDocument({
    onSuccess: () => {
      refresh();

      if (privacyPolicyDocumentExists) {
        enqueueSnackbar({
          variant: 'success',
          message: 'All required documents uploaded!',
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
      }
    },
  });

  return (
    <FileUploadSection>
      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        <FileUploadSectionTitle
          title="Terms & Conditions"
          subtitle="Legal document covering the relationship between you and your clients."
        />
        <Typography>
          Don't have one?{' '}
          <MuiLink
            href="https://termly.io/products/terms-and-conditions-generator/"
            target="_blank"
            rel="noreferrer"
          >
            Create for free*
          </MuiLink>
        </Typography>
      </Stack>
      <Box>
        <FileUpload
          isRemovable
          UploadButtonProps={{
            isLoading,
          }}
          value={{
            url: termsAndConditionsUrl,
          }}
          fileName="T&Cs.pdf"
          onDrop={(file) => {
            mutate({
              document: file.formData as FormData,
              documentType: 'TERMS_AND_CONDITIONS',
            });
          }}
          options={{
            accept: {
              'application/pdf': ['.pdf'],
            },
            maxSize: 2000000,
          }}
          helperText="Max. size: 2MB"
        />
      </Box>
    </FileUploadSection>
  );
}

export default TermsAndConditionsFileUpload;
