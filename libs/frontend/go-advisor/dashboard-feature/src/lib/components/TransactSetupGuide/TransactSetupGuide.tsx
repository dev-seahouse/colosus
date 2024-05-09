import { useCallback, useState } from 'react';
import { Box, Button, Card, Stack, Typography } from '@bambu/react-ui';
import type { TransactSetupGuideCardProps } from './TransactSetupGuideCards';
import TransactSetupGuideCard from './TransactSetupGuideCards';
import Scale from './assets/Scale';
import Sell from './assets/Sell';
import Passbook from './assets/Passbook';
import Question from './assets/Question';
import SearchBarIcon from './assets/SearchBarIcon';
import {
  useSelectKycStatus,
  useSelectTransactModelPortfolioIsConfigured,
  useSelectUserIsQuestionnaireReviewed,
} from '@bambu/go-advisor-core';
import IncompleteCustodianDialog from '../IncompleteCustodianDialog/IncompleteCustodianDialog';
import TransactSubscriptionDialog from '../TransactSubscriptionDialog/TransactSubscriptionDialog';
import { useSelectIsRoboSettingsConfigured } from '@bambu/go-advisor-settings-feature';

const TRANSACT_CARD_DETAILS: TransactSetupGuideCardProps[] = [
  {
    type: 'configureRoboSettings',
    cardTitle: 'Configure robo settings',
    icons: [<Scale />, <Sell />, <Passbook />],
    navigationPath: '../settings',
  },
  {
    type: 'reviewRiskQuestionnaire',
    cardTitle: 'Review risk questionnaire',
    icons: [<Question />, <Question />],
    navigationPath: '../risk-profile/questionnaire',
  },
  {
    type: 'configurePortfolios',
    cardTitle: 'Configure portfolios',
    icons: [<SearchBarIcon />],
    navigationPath: '../portfolios',
  },
];

function getRemainingNoOfSteps(
  isPortfolioConfigured: boolean | undefined,
  isRoboSettingsConfigured?: boolean | null,
  isRiskQuestionnaireReviewed?: boolean | null
) {
  const stepsArray = [
    isPortfolioConfigured,
    isRoboSettingsConfigured,
    isRiskQuestionnaireReviewed,
  ];
  const stepsCompleted = stepsArray.filter((step) => step === true);
  return 2 - stepsCompleted.length + 1;
}

export function TransactSetupGuide() {
  const [transactSubscriptionDialogOpen, setTransactSubscriptionDialogOpen] =
    useState(false);
  const [incompleteCustodianDialogOpen, setIncompleteCustodianDialogOpen] =
    useState(false);
  const { data: kycStatus } = useSelectKycStatus();

  const isUserKycStatusActive = kycStatus && kycStatus === 'ACTIVE';
  const isRiskQuestionnaireReviewed = useSelectUserIsQuestionnaireReviewed();

  const { data: isRoboSettingsConfigured } =
    useSelectIsRoboSettingsConfigured();

  const { data: isPortfolioConfigured } =
    useSelectTransactModelPortfolioIsConfigured();
  const handleTransactSubscriptionDialogClose = () =>
    setTransactSubscriptionDialogOpen(!transactSubscriptionDialogOpen);
  const handleIncompleteCustodianDialogClose = () =>
    setIncompleteCustodianDialogOpen(!incompleteCustodianDialogOpen);

  const handleUpgradeToTransactClick = useCallback(
    () =>
      isUserKycStatusActive
        ? handleTransactSubscriptionDialogClose()
        : handleIncompleteCustodianDialogClose(),
    [isUserKycStatusActive]
  );

  const stepsRemaining = getRemainingNoOfSteps(
    isPortfolioConfigured,
    isRoboSettingsConfigured,
    isRiskQuestionnaireReviewed
  );

  return (
    <Card>
      <Stack spacing={4} sx={{ p: 4, background: '#F3FFF8' }}>
        <Stack direction="row">
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              {stepsRemaining
                ? "Let's get your robo transaction-ready"
                : 'You’re ready to launch your transactional robo-advisor!'}
            </Typography>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {stepsRemaining
                ? `Just ${stepsRemaining} more step${
                    stepsRemaining > 1 ? 's' : ''
                  }  before you can start growing your
          clients & AUM!`
                : 'Upgrade your subscription to start sharing your transaction-ready robo with clients today'}
            </Typography>
          </Stack>
          {stepsRemaining ? null : (
            <Stack>
              <Box sx={{ whiteSpace: 'nowrap' }}>
                <Button onClick={handleUpgradeToTransactClick}>
                  Upgrade to Transact
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" spacing={3}>
          {TRANSACT_CARD_DETAILS.map((card) => (
            <TransactSetupGuideCard
              key={card.type}
              type={card.type}
              cardTitle={card.cardTitle}
              icons={card.icons}
              navigationPath={card.navigationPath}
            />
          ))}
        </Stack>
      </Stack>
      <TransactSubscriptionDialog
        open={transactSubscriptionDialogOpen}
        handleClose={handleTransactSubscriptionDialogClose}
      />
      <IncompleteCustodianDialog
        open={incompleteCustodianDialogOpen}
        handleClose={handleIncompleteCustodianDialogClose}
      />
    </Card>
  );
}

export default TransactSetupGuide;
