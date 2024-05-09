import {
  FileUpload,
  Box,
  enqueueSnackbar,
  MuiLink,
  closeSnackbar,
  Typography,
  Stack,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import {
  useSelectPrivacyPolicyDocumentUrlQuery,
  useSelectRefreshGetUploadedDocumentQuery,
  useSelectTermsAndConditionsDocumentExistsQuery,
} from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

import useUploadDocument from '../../hooks/useUploadDocument/useUploadDocument';
import FileUploadSection from '../FileUploadSection/FileUploadSection';
import FileUploadSectionTitle from '../FileUploadSectionTitle/FileUploadSectionTitle';

export function PrivacyPolicyFileUpload() {
  const { data: privacyPolicyUrl = '' } =
    useSelectPrivacyPolicyDocumentUrlQuery();
  const { data: termsAndConditionExists } =
    useSelectTermsAndConditionsDocumentExistsQuery();
  const refresh = useSelectRefreshGetUploadedDocumentQuery();
  const navigate = useNavigate();
  const { mutate, isLoading } = useUploadDocument({
    onSuccess: () => {
      refresh();

      // means the user has uploaded both document by now
      if (termsAndConditionExists) {
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
          title="Privacy policy"
          subtitle="This policy discloses the way you gather, manage and use client’s data."
        />
        <Typography>
          Don't have one?{' '}
          <MuiLink
            href="https://termly.io/products/privacy-policy-generator/"
            target="_blank"
            rel="noreferrer"
          >
            Create for free*
          </MuiLink>
        </Typography>
      </Stack>
      <Box>
        <FileUpload
          UploadButtonProps={{
            isLoading,
          }}
          value={{
            url: privacyPolicyUrl,
          }}
          fileName="Privacy_Policy.pdf"
          onDrop={(file) => {
            mutate({
              document: file?.formData as FormData,
              documentType: 'PRIVACY_POLICY',
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

export default PrivacyPolicyFileUpload;
