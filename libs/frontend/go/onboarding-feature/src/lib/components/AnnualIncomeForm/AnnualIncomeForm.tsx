import {
  Typography,
  Stack,
  Button,
  Form,
  useMobileView,
  Box,
  CurrencyField,
  Link,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectIncomePerAnnum,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectMonthlySavings,
  useSelectSetUserData,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import type { ConnectGetInvestorRiskQuestionnaireResponseDto } from '@bambu/api-client';

const ANNUAL_INCOME_FORM_CTA = 'Next';

const annualIncomeFormSchema = z
  .object({
    incomePerAnnum: z
      .number({ required_error: 'Annual income must be $1 or higher' })
      .min(1, 'Annual income must be $1 or higher'),
    monthlySavings: z
      .number({ required_error: 'Monthly savings must be $1 or higher' })
      .min(1, 'Monthly savings must be $1 or higher'),
  })
  .required();

export type AnnualIncomeFormState = z.infer<typeof annualIncomeFormSchema>;

interface AnnualIncomeFormProps {
  initialData?: ConnectGetInvestorRiskQuestionnaireResponseDto;
}
export function AnnualIncomeForm({ initialData }: AnnualIncomeFormProps) {
  const isMobileView = useMobileView();
  const incomePerAnnum = useSelectIncomePerAnnum();
  const monthlySavings = useSelectMonthlySavings();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const setUserData = useSelectSetUserData();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<AnnualIncomeFormState>({
    resolver: zodResolver(annualIncomeFormSchema),
    defaultValues: {
      incomePerAnnum,
      monthlySavings,
    },
    mode: 'onTouched',
  });
  const navigate = useNavigate();

  const {
    data: questionnaireGroup,
    isSuccess,
    isLoading,
  } = useSelectInvestorQuestionnaireGroupByKey({
    key: 'FINANCIAL_HEALTH',
    initialData,
  });

  const onSubmit = handleSubmit(({ incomePerAnnum, monthlySavings }) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return null;

    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerId: '',
      answerScoreNumber: calculateMonthlyIncomeScore(
        monthlySavings,
        incomePerAnnum
      ),
    });
    setUserData({ incomePerAnnum, monthlySavings, currentSavings: null });
    navigate('../../select-goal');
  });

  return (
    <Form
      id="annual-income-form"
      data-testid="annual-income-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={10}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            What’s your annual income and monthly savings?
          </Typography>
          <Controller
            render={({ field: { onChange, value } }) => (
              <CurrencyField
                allowNegative={false}
                label="Annual income"
                placeholder="Enter annual income"
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!errors.incomePerAnnum}
                helperText={errors.incomePerAnnum?.message}
              />
            )}
            name="incomePerAnnum"
            control={control}
          />
          <Controller
            render={({ field: { onChange, value } }) => (
              <CurrencyField
                allowNegative={false}
                label="Monthly savings"
                placeholder="Enter monthly savings"
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!errors.monthlySavings}
                helperText={
                  errors.monthlySavings?.message ??
                  "We're asking this to ensure that we provide a plan that is right for your finances"
                }
              />
            )}
            name="monthlySavings"
            control={control}
          />
        </Stack>
        <Box display="flex" alignItems="center" justifyContent="space-around">
          <Link to="../cash-savings" underline="always">
            I'm retired
          </Link>
        </Box>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <Button type="submit">{ANNUAL_INCOME_FORM_CTA}</Button>
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <Button type="submit" fullWidth>
            {ANNUAL_INCOME_FORM_CTA}
          </Button>
        </BottomAction>
      )}
    </Form>
  );
}

export default AnnualIncomeForm;

function calculateMonthlyIncomeScore(
  monthlySavings: number,
  annualIncome: number
) {
  return (monthlySavings / (annualIncome / 12)) * 100;
}
