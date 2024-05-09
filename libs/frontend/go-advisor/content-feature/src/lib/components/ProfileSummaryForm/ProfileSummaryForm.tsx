import {
  Grid,
  Button,
  Stack,
  Form,
  enqueueSnackbar,
  Box,
  MuiLink,
  closeSnackbar,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import {
  SectionContainer,
  useSelectProfileSummaryContentQuery,
  useSelectUpdateProfileDetailsQuery,
} from '@bambu/go-advisor-core';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import ProfileSummaryEditor from '../ProfileSummaryEditor/ProfileSummaryEditor';
import LinkToProfileField from '../LinkToProfileField/LinkToProfileField';
import ProfileSummaryPreview from '../ProfileSummaryPreview/ProfileSummaryPreview';
import useUpdateProfileSummary from '../../hooks/useUpdateProfileSummary/useUpdateProfileSummary';
import sanitizeContent from '../../utils/sanitizeContent/sanitizeContent';
import { z } from 'zod';

const urlSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !value.includes(' ');
    } catch (error) {
      return false;
    }
  }, 'Invalid URL format');

const profileSummaryFormSchema = z
  .object({
    richText: z.string().min(1),
    fullProfileLink: z.union([z.literal(''), urlSchema]),
  })
  .required();

export type ProfileSummaryFormState = z.infer<typeof profileSummaryFormSchema>;

export function ProfileSummaryForm() {
  const updateProfileDetails = useSelectUpdateProfileDetailsQuery();
  const navigate = useNavigate();
  const { mutate, isLoading } = useUpdateProfileSummary({
    onSuccess: () => {
      enqueueSnackbar({
        variant: 'success',
        message: 'Content saved!',
        action: (snackbarId) => (
          <Box display="flex" sx={{ gap: 1 }}>
            <MuiLink
              component="button"
              onClick={() => {
                closeSnackbar(snackbarId);
                navigate(-1);
              }}
            >
              Edit more content
            </MuiLink>
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
          </Box>
        ),
      });
      updateProfileDetails();
    },
  });
  const { data } = useSelectProfileSummaryContentQuery();
  const methods = useForm<ProfileSummaryFormState>({
    defaultValues: {
      richText: sanitizeContent(data?.profileBioRichText ?? ''),
      fullProfileLink: data?.fullProfileLink ?? '',
    },
    mode: 'onTouched',
    resolver: zodResolver(profileSummaryFormSchema),
  });

  const onSubmit = methods.handleSubmit((data) => {
    mutate({
      richText: sanitizeContent(data.richText),
      fullProfileLink: data.fullProfileLink,
    });
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="profile-summary-form"
        data-testid="profile-summary-form"
        onSubmit={onSubmit}
      >
        <Grid spacing={3} container>
          <Grid item xs={12} md={7}>
            <Grid spacing={5} container>
              <Grid item xs={12}>
                <SectionContainer>
                  <Stack spacing={4}>
                    <ProfileSummaryEditor />
                    <LinkToProfileField />
                  </Stack>
                </SectionContainer>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" isLoading={isLoading}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <ProfileSummaryPreview />
          </Grid>
        </Grid>
      </Form>
    </FormProvider>
  );
}

export default ProfileSummaryForm;
