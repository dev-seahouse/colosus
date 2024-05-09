import { Stack, Box, Button, Form } from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Heading from '../Heading/Heading';
import BrandFields from '../BrandFields/BrandFields';
import ClientExperienceFields from '../ClientExperienceFields/ClientExperienceFields';
import SectionHeading from '../SectionHeading/SectionHeading';
import SubdomainConfirmationDialog from '../SubdomainConfirmationDialog/SubdomainConfirmationDialog';
import DomainRuleInstruction from '../ClientExperienceFields/DomainRuleInstruction';
import { platformSetupFormSchema } from '../../schema/platform.schema';

export type PlatformSetupFormState = z.infer<typeof platformSetupFormSchema>;

export function PlatformSetupForm() {
  const methods = useForm<PlatformSetupFormState>({
    resolver: zodResolver(platformSetupFormSchema),
    mode: 'onTouched',
  });
  const [open, setOpen] = useState(false);

  const onValidForm = methods.handleSubmit(() => {
    setOpen(true);
  });

  return (
    <FormProvider {...methods}>
      <Form id="platform-setup-form" data-testid="platform-setup-form">
        <Stack spacing={7}>
          <Stack spacing={4}>
            <Heading title="Set up your robo-advisor" />
            <Box>
              <Stack spacing={1}>
                <SectionHeading
                  title="Give your robo-advisor a name"
                  subtitle="Don’t worry you can change this later"
                />
                <BrandFields />
              </Stack>
            </Box>
            <Box>
              <Stack spacing={2}>
                <SectionHeading
                  title="Create a link for your robo-advisor"
                  subtitle="This is the link that you can share with your clients and use in your marketing"
                />
                <DomainRuleInstruction />
                <ClientExperienceFields />
              </Stack>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              onClick={onValidForm}
              type="submit"
              data-testid="platform-setup-form-btn"
            >
              Set up
            </Button>
          </Box>
        </Stack>
        <SubdomainConfirmationDialog
          open={open}
          handleClose={() => setOpen(false)}
        />
      </Form>
    </FormProvider>
  );
}

export default PlatformSetupForm;
