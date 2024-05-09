import {
  List,
  Form,
  Typography,
  FormControl,
  FormHelperText,
  Stack,
  useMobileView,
  Box,
  Button,
} from '@bambu/react-ui';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelectRiskAppetite, useSelectSetUserData } from '@bambu/go-core';
import { InvestmentStyleQuestionaireBottomAction } from '@bambu/go-goal-settings-feature';
import { useNavigate } from 'react-router-dom';
import { useSelectSetHasSelectedRiskQuestionnaire } from '@bambu/go-core';
import { useGTMSetInvestmentStyleEvent } from '@bambu/go-analytics';
import {
  InvestmentStyleListItem,
  InvestmentStyleListAction,
} from '@bambu/go-core';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {
  transformRiskProfiles,
  useGetInvestorRiskProfiles,
} from '@bambu/go-goal-settings-feature';
import { useEffect } from 'react';
import React from 'react';

const investmentStyleFormSchema = z
  .object({
    riskAppetite: z
      .string({
        required_error: 'Please select an investment style',
      })
      .min(1, 'Please select an investment style'),
  })
  .required();

export type InvestmentStyleFormState = z.infer<
  typeof investmentStyleFormSchema
>;

export function InvestmentStyleList() {
  const isMobileView = useMobileView();
  const riskAppetite = useSelectRiskAppetite();
  const setUserData = useSelectSetUserData();
  const navigate = useNavigate();
  const { data: riskProfiles, isLoading } = useGetInvestorRiskProfiles();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<InvestmentStyleFormState>({
    resolver: zodResolver(investmentStyleFormSchema),
    defaultValues: {
      riskAppetite,
    },
  });

  const gtmSetInvestmentStyleEvent = useGTMSetInvestmentStyleEvent();
  const setRiskQuestionnaireSelection =
    useSelectSetHasSelectedRiskQuestionnaire();
  const setHasSetHasSelectedRiskQuestionnaire =
    useSelectSetHasSelectedRiskQuestionnaire();

  const riskProfilesByNameMap = transformRiskProfiles(riskProfiles || []);

  useEffect(() => {
    // if user navigates back to this page, we want to reset the risk questionnaire selection
    // the bug:
    // 1. user is at retirement/investment-style
    // 2. user selected  "i don't know my risk profile"
    // 3. user answers one of the questions and click on next
    // 4. user click back button and back button again, landing on retirement/investment-style
    // 5. user clicks next , without this you will see hasSelectedRiskQuestionnaire: true
    setHasSetHasSelectedRiskQuestionnaire(false);
  }, [setHasSetHasSelectedRiskQuestionnaire]);

  const onSubmit = handleSubmit((data) => {
    gtmSetInvestmentStyleEvent({ value: data.riskAppetite });
    const riskProfileId = riskProfiles?.find(
      byRiskProfileName(data.riskAppetite)
    )?.id;

    setUserData({ ...data, riskProfileId });
    navigate('../setup-contribution');
  });

  if (!riskProfiles || isLoading) {
    return null;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ pb: '6rem' }}>
        <Stack spacing={2}>
          <Typography variant="h1" textAlign="center" mobiletextalign="left">
            What’s your investment style?
          </Typography>
          <Typography textAlign="center" mobiletextalign="left">
            Click the options below to view the description
          </Typography>
          <FormControl fullWidth>
            <Controller
              render={({ field: { onChange, value } }) => (
                <List aria-label="investment style list">
                  <InvestmentStyleListItem
                    title={
                      <Typography fontWeight={'bold'}>
                        {riskProfilesByNameMap['Very Conservative']?.name}
                      </Typography>
                    }
                    key={riskProfilesByNameMap['Very Conservative']?.name}
                    id={riskProfilesByNameMap['Very Conservative']?.name}
                    description={renderRiskProfileContent(
                      riskProfilesByNameMap['Very Conservative'].description
                    )}
                    onSelect={onChange}
                    selected={
                      value === riskProfilesByNameMap['Very Conservative'].name
                    }
                  />
                  <InvestmentStyleListItem
                    title={
                      <Typography fontWeight={'bold'}>
                        {riskProfilesByNameMap['Conservative']?.name}
                      </Typography>
                    }
                    key={riskProfilesByNameMap['Conservative']?.name}
                    id={riskProfilesByNameMap['Conservative']?.name}
                    description={renderRiskProfileContent(
                      riskProfilesByNameMap['Conservative'].description
                    )}
                    onSelect={onChange}
                    selected={
                      value === riskProfilesByNameMap['Conservative'].name
                    }
                  />
                  <InvestmentStyleListItem
                    title={
                      <Typography fontWeight={'bold'}>
                        {riskProfilesByNameMap['Balanced']?.name}
                      </Typography>
                    }
                    key={riskProfilesByNameMap['Balanced']?.name}
                    id={riskProfilesByNameMap['Balanced']?.name}
                    description={renderRiskProfileContent(
                      riskProfilesByNameMap['Balanced'].description
                    )}
                    onSelect={onChange}
                    selected={value === riskProfilesByNameMap['Balanced'].name}
                  />
                  <InvestmentStyleListItem
                    title={
                      <Typography fontWeight={'bold'}>
                        {riskProfilesByNameMap['Growth']?.name}
                      </Typography>
                    }
                    key={riskProfilesByNameMap['Growth']?.name}
                    id={riskProfilesByNameMap['Growth']?.name}
                    description={renderRiskProfileContent(
                      riskProfilesByNameMap['Growth'].description
                    )}
                    onSelect={onChange}
                    selected={value === riskProfilesByNameMap['Growth'].name}
                  />
                  <InvestmentStyleListItem
                    title={
                      <Typography fontWeight={'bold'}>
                        {riskProfilesByNameMap['Aggressive']?.name}
                      </Typography>
                    }
                    key={riskProfilesByNameMap['Aggressive']?.name}
                    id={riskProfilesByNameMap['Aggressive']?.name}
                    description={renderRiskProfileContent(
                      riskProfilesByNameMap['Aggressive'].description
                    )}
                    onSelect={onChange}
                    selected={
                      value === riskProfilesByNameMap['Aggressive'].name
                    }
                  />
                </List>
              )}
              name="riskAppetite"
              control={control}
            />
            {errors?.riskAppetite && (
              <FormHelperText error>
                {errors?.riskAppetite.message}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          sx={{ pb: 3 }}
        >
          <Button
            sx={{ bg: 'transparent' }}
            startIcon={<AutoFixHighIcon />}
            variant="text"
            onClick={() => {
              setRiskQuestionnaireSelection(true);
              navigate('../investment-style-question-one');
            }}
          >
            I don't know my risk profile
          </Button>
        </Box>
        {!isMobileView && (
          <Box display="flex" justifyContent="space-around">
            <InvestmentStyleListAction />
          </Box>
        )}
        {isMobileView && <InvestmentStyleQuestionaireBottomAction />}
      </Stack>
    </Form>
  );
}

export default InvestmentStyleList;

function byRiskProfileName(riskAppetite: string) {
  return (r: { riskProfileName: string }) => r.riskProfileName === riskAppetite;
}

function renderRiskProfileContent(p: string[]) {
  return (selected: boolean) => (
    <Box>
      {selected
        ? React.Children.toArray(
            p.map((row) => (
              <Typography sx={{ textTransform: 'none' }} key={row} mb={1}>
                {row}
              </Typography>
            ))
          )
        : null}
    </Box>
  );
}
