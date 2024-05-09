import {
  Box,
  Button,
  Form,
  Stack,
  TextField,
  Typography,
  useMobileView,
} from '@bambu/react-ui';
import {
  BottomAction,
  useSelectAge,
  useSelectInvestorQuestionnaireGroupByKey,
  useSelectName,
  useSelectSetUserData,
  useSelectUpdateRiskQuestionnaire,
} from '@bambu/go-core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import type { ConnectGetInvestorRiskQuestionnaireResponseDto } from '@bambu/api-client';

const AGE_FORM_CTA = 'Next';

const ageFormSchema = z
  .object({
    age: z
      .number({ required_error: 'Age must be between 18 and 80' })
      .min(18, 'Age must be between 18 and 80')
      .max(80, 'Age must be between 18 and 80 '),
  })
  .required();

export type AgeFormState = z.infer<typeof ageFormSchema>;

interface AgeFormProps {
  initialData?: ConnectGetInvestorRiskQuestionnaireResponseDto;
}

export function AgeForm({ initialData }: AgeFormProps) {
  const {
    data: questionnaireGroup,
    isSuccess,
    isLoading,
  } = useSelectInvestorQuestionnaireGroupByKey({
    key: 'AGE',
    initialData,
  });

  const isMobileView = useMobileView();
  const navigate = useNavigate();
  const age = useSelectAge();
  const setUserData = useSelectSetUserData();
  const updateRiskQuestionnaireStore = useSelectUpdateRiskQuestionnaire();
  const name = useSelectName();

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<AgeFormState>({
    resolver: zodResolver(ageFormSchema),
    defaultValues: {
      age,
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit((data) => {
    if (!isSuccess || isLoading || !questionnaireGroup) return;
    updateRiskQuestionnaireStore({
      questionnaireGroup,
      questionId: questionnaireGroup.Questions[0].id,
      answerScoreNumber: data.age,
      answerId: '',
    });

    setUserData(data);
    navigate('../annual-income');
  });

  return (
    <Form id="age-form" data-testid="age-form" onSubmit={onSubmit}>
      <Stack spacing={10}>
        <Stack spacing={3}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            Hi {name}! How old are you?
          </Typography>
          <Controller
            render={({ field: { onChange, value } }) => (
              <NumericFormat
                decimalScale={0}
                allowNegative={false}
                label="Age"
                placeholder="Enter age"
                customInput={TextField}
                value={value}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
                error={!!errors.age}
                suffix=" years old"
                helperText={
                  errors.age?.message ??
                  'Knowing your age lets us provide the most accurate planning for your goals'
                }
              />
            )}
            name="age"
            control={control}
          />
        </Stack>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <Button type="submit">{AGE_FORM_CTA}</Button>
          </Box>
        )}
      </Stack>
      {isMobileView && (
        <BottomAction>
          <Button type="submit" fullWidth>
            {AGE_FORM_CTA}
          </Button>
        </BottomAction>
      )}
    </Form>
  );
}

export default AgeForm;
