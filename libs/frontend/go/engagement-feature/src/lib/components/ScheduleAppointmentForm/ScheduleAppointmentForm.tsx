import { Button, Form, Stack, Typography } from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AdvisorProfileDetails,
  PlatformTermsConditionCheckbox,
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

export type ScheduleAppointmentFormState = z.infer<
  typeof scheduleAppointmentSchema
>;

export function ScheduleAppointmentForm() {
  const riskProfileId = useSelectRiskProfileId();
  if (!riskProfileId) {
    throw new Error('Risk profile id is required');
  }
  const { data: modelPortfolio, isSuccess: isModelPortfolioSuccess } =
    useSelectModelPortfolioByRiskProfileId({
      riskProfileId: riskProfileId,
    });

  const methods = useForm<ScheduleAppointmentFormState>({
    resolver: zodResolver(scheduleAppointmentSchema),
    mode: 'onTouched',
    defaultValues: {
      sendGoalProjectionEmail: false,
    },
  });
  const navigate = useNavigate();
  const { handleSubmit, control } = methods;
  const { mutate, isLoading } = useSaveLead({
    onSuccess: () =>
      navigate(
        `/appointment-scheduled?email=${methods.getValues(
          'sendGoalProjectionEmail'
        )}`
      ),
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
      sendAppointmentEmail: false,
      riskAppetite: modelPortfolio.id,
      ...leadData,
    });
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="schedule-appointment-form"
        data-testid="schedule-appointment-form"
        onSubmit={onSubmit}
      >
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Typography variant="h1">
              Ready to take the next step towards achieving your financial goal?
            </Typography>
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
          <PlatformTermsConditionCheckbox control={control} name="hasAgreed" />
          <SendInsightEmailCheckbox />
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default ScheduleAppointmentForm;
