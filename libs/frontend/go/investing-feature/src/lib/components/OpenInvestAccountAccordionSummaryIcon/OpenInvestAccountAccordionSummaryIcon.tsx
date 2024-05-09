import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export interface OpenInvestAccountAccordionSummaryIconProps {
  isTouched: boolean;
  hasError: boolean;
}

export function OpenInvestAccountAccordionSummaryIcon(
  props: OpenInvestAccountAccordionSummaryIconProps
) {
  const { hasError, isTouched } = props;

  if (hasError) {
    return (
      <ErrorIcon className="isError" color="error" sx={{ opacity: 0.8 }} />
    );
  } else if (isTouched) {
    return <CheckCircleIcon className="isValid" color="success" />;
  } else {
    return <ExpandMoreIcon />;
  }
}

export default OpenInvestAccountAccordionSummaryIcon;
