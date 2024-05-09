import { Button, Form, Stack, Typography } from '@bambu/react-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PlatformTermsConditionCheckbox,
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
  useSelectSaveLeadPayload,
} from '@bambu/go-core';
import { useNavigate } from 'react-router-dom';

import NameField from '../NameField/NameField';
import EmailField from '../EmailField/EmailField';
import useSaveLead from '../../hooks/useSaveLead/useSaveLead';
import ConfidentialInformationDisclaimer from '../ConfidentialInformationDisclaimer/ConfidentialInformationDisclaimer';

const getFinancialPlanFormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Your email address is required')
      .email('Please enter a valid email'),
    name: z.string().min(1, 'Your name is required'),
    hasAgreed: z.literal(true, {
      errorMap: () => ({
        message: 'Please acknowledge the above agreement',
      }),
    }),
  })
  .required();

export type GetFinancialPlanFormState = z.infer<
  typeof getFinancialPlanFormSchema
>;

export function GetFinancialPlanForm() {
  const riskProfileId = useSelectRiskProfileId();
  if (!riskProfileId) {
    throw new Error('Risk profile id is required');
  }
  const { data: modelPortfolio, isSuccess: isModelPortfolioSuccess } =
    useSelectModelPortfolioByRiskProfileId({
      riskProfileId: riskProfileId,
    });

  const methods = useForm<GetFinancialPlanFormState>({
    resolver: zodResolver(getFinancialPlanFormSchema),
    mode: 'onTouched',
  });
  const navigate = useNavigate();

  const { handleSubmit } = methods;
  const { mutate, isLoading } = useSaveLead({
    onSuccess: () => navigate('/financial-plan-sent'),
  });

  const leadData = useSelectSaveLeadPayload();

  const onSubmit = handleSubmit((data) => {
    const { name, email } = data;

    if (!isModelPortfolioSuccess || typeof modelPortfolio?.id !== 'string') {
      return;
    }

    mutate({
      name,
      email,
      sendGoalProjectionEmail: true,
      phoneNumber: '',
      sendAppointmentEmail: false,
      riskAppetite: modelPortfolio.id,
      ...leadData,
    });
  });

  return (
    <FormProvider {...methods}>
      <Form
        id="get-financial-plan-form"
        data-testid="get-financial-plan-form"
        onSubmit={onSubmit}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" textTransform="capitalize">
              Get a copy of your financial plan
            </Typography>
            <Typography>
              Simply provide your details below and we’ll send it direct to your
              inbox
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <NameField />
            <EmailField />
          </Stack>
          <ConfidentialInformationDisclaimer />
          <PlatformTermsConditionCheckbox
            control={methods.control}
            name="hasAgreed"
          />
          <Button type="submit" isLoading={isLoading}>
            Send me the financial plan
          </Button>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default GetFinancialPlanForm;
