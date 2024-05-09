import {
  styled,
  type AccordionSummaryProps,
  AccordionSummary,
} from '@bambu/react-ui';

export const OpenInvestAccountAccordionSummary = styled(
  AccordionSummary
)<AccordionSummaryProps>(({ theme }) => ({
  minHeight: '56px',
  '&.Mui-expanded': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  '.MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    color: 'white',
    '&>.isError': {
      color: 'white',
      transform: 'rotate(180deg)',
    },
    '&>.isValid': {
      color: 'white',
      transform: 'rotate(180deg)',
    },
  },
}));

export default OpenInvestAccountAccordionSummary;
