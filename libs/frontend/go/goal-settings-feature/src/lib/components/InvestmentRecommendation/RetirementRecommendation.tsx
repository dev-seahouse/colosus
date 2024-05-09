import { Typography, IconButton } from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  useSelectGoalValue,
  BoxWithLightenedPrimaryColor,
  CurrencyText,
} from '@bambu/go-core';
import { useState } from 'react';
import EmphasizedInlineText from './EmphasizedInlineText';
import RetirementRecommendationDialog from './RetirementRecommendationDialog';
import { useSelectRetirementAge } from '../../store/useGoalSettingsStore.selectors';
import { useSelectContributionRecommendationQuery } from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection.selectors';

export const RetirementRecommendation = () => {
  const retirementAge = useSelectRetirementAge();
  const goalValue = useSelectGoalValue();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: contribution = 0 } = useSelectContributionRecommendationQuery();

  const handleToggleDialog = () => {
    setIsDialogOpen((prevIsDialogOpen) => !prevIsDialogOpen);
  };

  return (
    <>
      <BoxWithLightenedPrimaryColor p={2}>
        <Typography>
          Invest{' '}
          <EmphasizedInlineText>
            <CurrencyText value={contribution} suffix="/mo" />
          </EmphasizedInlineText>{' '}
          until you're
          <EmphasizedInlineText>{` ${retirementAge} `}</EmphasizedInlineText>
          and you’re likely to achieve your goal of{' '}
          <EmphasizedInlineText>
            <CurrencyText value={goalValue} decimalScale={0} />
          </EmphasizedInlineText>
          <IconButton
            onClick={handleToggleDialog}
            aria-label="open retirement recommendation tooltip"
            color="primary"
            size="small"
            sx={{ position: 'relative', top: -2 }}
          >
            <InfoOutlinedIcon sx={{ height: 16, width: 16 }} />
          </IconButton>
        </Typography>
      </BoxWithLightenedPrimaryColor>
      <RetirementRecommendationDialog
        onClose={handleToggleDialog}
        open={isDialogOpen}
      />
    </>
  );
};

export default RetirementRecommendation;
