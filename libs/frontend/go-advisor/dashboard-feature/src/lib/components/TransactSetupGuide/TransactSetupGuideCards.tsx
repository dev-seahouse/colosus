import React from 'react';

import { useNavigate } from 'react-router-dom';

import {
  useSelectTransactModelPortfolioIsConfigured,
  useSelectUserIsQuestionnaireReviewed,
} from '@bambu/go-advisor-core';
import { useSelectIsRoboSettingsConfigured } from '@bambu/go-advisor-settings-feature';

import {
  Box,
  Card,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@bambu/react-ui';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface TransactSetupGuideCardProps {
  type: string;
  cardTitle: string;
  icons: JSX.Element[];
  navigationPath: string;
}

export function TransactSetupGuideCard({
  type,
  cardTitle,
  icons,
  navigationPath,
}: TransactSetupGuideCardProps) {
  const navigate = useNavigate();
  const isRiskQuestionnaireReviewed = useSelectUserIsQuestionnaireReviewed();
  const { data: isRoboSettingsConfigured } =
    useSelectIsRoboSettingsConfigured();
  const { data: isPortfolioConfigured } =
    useSelectTransactModelPortfolioIsConfigured();

  const status =
    (type === 'configureRoboSettings' && isRoboSettingsConfigured) ||
    (type === 'reviewRiskQuestionnaire' && isRiskQuestionnaireReviewed) ||
    (type === 'configurePortfolios' && isPortfolioConfigured) ? (
      <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
    ) : (
      <CheckCircleOutlineIcon color="disabled" sx={{ fontSize: 20 }} />
    );

  return (
    <Card
      elevation={2}
      onClick={() => navigate(navigationPath)}
      sx={{
        transition: 'transform .1s',
        '&:hover': {
          cursor: 'pointer',
          transform: 'scale(1.03) perspective(0px)',
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }} component={Paper}>
        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center">
            {status}
            <Box px={0.4}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ whiteSpace: 'nowrap' }}
              >
                {cardTitle}
              </Typography>
            </Box>
          </Stack>
          <IconButton>
            <ArrowForwardIcon color="success" sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        sx={{
          background: '#DCF7EB',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '126px',
          '&:not(:last-child)': {
            paddingRight: 0.5,
          },
          '&': {
            paddingLeft: 0.5,
          },
        }}
      >
        <Stack direction="row" spacing={0.2}>
          {React.Children.toArray(icons.map((icons) => icons))}
        </Stack>
      </Stack>
    </Card>
  );
}

export default TransactSetupGuideCard;
