import { Button, Form, Stack, Typography } from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AdvisorProfileDetails,
  PlatformTermsConditionCheckbox,
  useSelectAdvisorContactLink,
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
  useSelectSaveLeadPayload,
} from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';

import NameField from '../NameField/NameField';
import EmailField from '../EmailField/EmailField';
import PhoneField from '../PhoneField/PhoneField';
import useSaveLead from '../../hooks/useSaveLead/useSaveLead';
import SendInsightEmailCheckbox from '../SendInsightEmailCheckbox/SendInsightEmailCheckbox';
import { scheduleAppointmentSchema } from '../../schema/schedule-appointment.schema';

export type ScheduleAppointmentWithLinkFormState = z.infer<
  typeof scheduleAppointmentSchema
>;

export function ScheduleAppointmentWithLinkForm() {
  const riskProfileId = useSelectRiskProfileId();
  if (!riskProfileId) {
    throw new Error('Risk profile id is required');
  }
  const { data: modelPortfolio, isSuccess: isModelPortfolioSuccess } =
    useSelectModelPortfolioByRiskProfileId({
      riskProfileId: riskProfileId,
    });

  const methods = useForm<ScheduleAppointmentWithLinkFormState>({
    resolver: zodResolver(scheduleAppointmentSchema),
    mode: 'onTouched',
    defaultValues: {
      sendGoalProjectionEmail: false,
    },
  });
  const navigate = useNavigate();
  const { handleSubmit } = methods;
  const { data: contactLink } = useSelectAdvisorContactLink();
  const { mutate, isLoading } = useSaveLead({
    onSuccess: () => {
      window.open(contactLink, '_blank');
      navigate(
        `/appointment-scheduled?email=${methods.getValues(
          'sendGoalProjectionEmail'
        )}`
      );
    },
  });
  const leadData = useSelectSaveLeadPayload();

  const onSubmit = handleSubmit((data) => {
    const { name, email, phoneNumber, sendGoalProjectionEmail } = data;

    if (!isModelPortfolioSuccess || typeof modelPortfolio?.id !== 'string') {
      return;
    }
    mutate({
      name,
      email,
      phoneNumber,
      sendGoalProjectionEmail,
      sendAppointmentEmail: true,
      riskAppetite: modelPortfolio.id,
      ...leadData,
    });
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="schedule-appointment-with-link-form"
        data-testid="schedule-appointment-with-link-form"
        onSubmit={onSubmit}
      >
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Typography variant="h1">Let's make your goal a reality</Typography>
            <Typography>
              Schedule a free, no-obligation meeting with our financial advisor
            </Typography>
          </Stack>
          <AdvisorProfileDetails />
          <Stack spacing={1}>
            <NameField />
            <EmailField />
            <PhoneField />
          </Stack>
          <PlatformTermsConditionCheckbox
            control={methods.control}
            name="hasAgreed"
          />
          <SendInsightEmailCheckbox />
          <Stack spacing={2}>
            <Button type="submit" isLoading={isLoading}>
              Schedule a meeting
            </Button>
            <Typography>
              Please note, you will be redirected to an external platform to
              schedule the meeting
            </Typography>
          </Stack>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default ScheduleAppointmentWithLinkForm;
