import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@bambu/react-ui';
import type { DialogProps } from '@bambu/react-ui';
import { useSelectGoalTimeframe } from '@bambu/go-core';
import { NumericFormat } from 'react-number-format';
import EmphasizedInlineText from './EmphasizedInlineText';
import { useSelectInflationRateQuery } from '../../hooks/useGetCountryRate/useGetCountryRate.selectors';

export interface RetirementRecommendationDialogProps
  extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

export const RetirementRecommendationDialog = ({
  onClose,
  open,
}: RetirementRecommendationDialogProps) => {
  const goalTimeframe = useSelectGoalTimeframe();
  const { data: inflationRate = 0 } = useSelectInflationRateQuery();

  return (
    <Dialog
      aria-labelledby="retirement-recommendation-title"
      aria-describedby="retirement-recommendation-description"
      open={open}
    >
      <DialogTitle id="retirement-recommendation-title" fontWeight={700}>
        Retirement goal amount
      </DialogTitle>
      <DialogContent id="retirement-recommendation-description">
        We've taken into account your current monthly expenses and projected
        them into the future, accounting for an inflation rate of{' '}
        <EmphasizedInlineText>
          <NumericFormat
            displayType="text"
            value={inflationRate * 100}
            suffix="%"
            decimalScale={1}
            fixedDecimalScale
          />
        </EmphasizedInlineText>{' '}
        over a period of{' '}
        <EmphasizedInlineText>{goalTimeframe}</EmphasizedInlineText> years. This
        calculation will help you determine the total amount of savings you
        should aim to accumulate by the time you retire.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetirementRecommendationDialog;
