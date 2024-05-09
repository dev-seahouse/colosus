import {
  Typography,
  Stack,
  Button,
  Form,
  useMobileView,
  Box,
  CurrencyField,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectCurrentSavings,
  useSelectSetUserData,
} from '@bambu/go-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const CASH_SAVINGS_FORM_CTA = 'Next';

const cashSavingsFormSchema = z
  .object({
    currentSavings: z
      .number({ required_error: 'Cash savings must be $1 or higher' })
      .min(1, 'Cash savings must be $1 or higher'),
  })
  .required();

export type CashSavingsFormState = z.infer<typeof cashSavingsFormSchema>;

export function CashSavingsForm() {
  const isMobileView = useMobileView();
  const currentSavings = useSelectCurrentSavings();
  const setUserData = useSelectSetUserData();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CashSavingsFormState>({
    resolver: zodResolver(cashSavingsFormSchema),
    defaultValues: {
      currentSavings,
    },
    mode: 'onTouched',
  });
  const navigate = useNavigate();

  const onSubmit = handleSubmit(({ currentSavings }) => {
    setUserData({ currentSavings, incomePerAnnum: null });
    navigate('../investment-style');
  });

  return (
    <Form
      id="cash-savings-form"
      data-testid="cash-savings-form"
      onSubmit={onSubmit}
    >
      <Stack spacing={10}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            How much do you have in cash savings?
          </Typography>
          <Controller
            render={({ field: { onChange, value } }) => (
              <CurrencyField
                allowNegative={false}
                label="Cash savings"
                placeholder="Enter cash savings"
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!errors.currentSavings}
                helperText={
                  errors.currentSavings?.message ?? 'An approximate is fine'
                }
              />
            )}
            name="currentSavings"
            control={control}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <Button type="submit">{CASH_SAVINGS_FORM_CTA}</Button>
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <Button type="submit" fullWidth>
            {CASH_SAVINGS_FORM_CTA}
          </Button>
        </BottomAction>
      )}
    </Form>
  );
}

export default CashSavingsForm;
