import ContactMeEditor from '../ContactMeEditor/ContactMeEditor';
import {
  Box,
  Button,
  Grid,
  Form,
  enqueueSnackbar,
  closeSnackbar,
  MuiLink,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import {
  SectionContainer,
  useSelectContactMeContentQuery,
  useSelectUpdateProfileDetailsQuery,
} from '@bambu/go-advisor-core';
import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';
import { useNavigate } from 'react-router-dom';
import SchedulingPlatformLinkSection from './SchedulingPlatformLinkSection';
import ContactMePreview from '../ContactMePreview/ContactMePreview';
import UploadAdvisorPictureButton from '../UploadAdvisorPictureButton/UploadAdvisorPictureButton';
import useUpdateContactMe from '../../hooks/useUpdateContactMe/useUpdateContactMe';
import sanitizeContent from '../../utils/sanitizeContent/sanitizeContent';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactMeFormSchema = z
  .object({
    richText: z.string().min(1),
    contactLink: z.union([
      z.string().url({ message: 'Please enter a valid link' }).nullish(),
      z.literal(''),
    ]),
  })
  .required();

export type ContactMeFormState = z.infer<typeof contactMeFormSchema>;

export function ContactMeForm() {
  const { data } = useSelectContactMeContentQuery();
  const updateProfileDetails = useSelectUpdateProfileDetailsQuery();
  const methods = useForm<ContactMeFormState>({
    defaultValues: {
      richText: sanitizeContent(data?.contactMeReasonsRichText ?? ''),
      contactLink: data?.contactLink,
    },
    resolver: zodResolver(contactMeFormSchema),
    mode: 'onTouched',
  });
  const isContactLinkEnabled = useFeatureFlag('feature_scheduling_link');
  const navigate = useNavigate();
  const { mutate, isLoading } = useUpdateContactMe({
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

  const onSubmit = methods.handleSubmit((data) => {
    mutate({
      richText: sanitizeContent(data.richText),
      contactLink: data.contactLink,
    });
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="contact-me-form"
        data-testid="contact-me-form"
        onSubmit={onSubmit}
      >
        <Grid spacing={3} container>
          <Grid item xs={12} md={7}>
            <Grid spacing={5} container>
              <Grid item xs={12}>
                <SectionContainer>
                  <UploadAdvisorPictureButton />
                  <ContactMeEditor />
                  {isContactLinkEnabled ? (
                    <SchedulingPlatformLinkSection />
                  ) : null}
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
            <ContactMePreview />
          </Grid>
        </Grid>
      </Form>
    </FormProvider>
  );
}

export default ContactMeForm;
