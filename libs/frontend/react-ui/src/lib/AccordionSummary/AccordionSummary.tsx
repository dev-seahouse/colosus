import MuiAccordionSummary from '@mui/material/AccordionSummary';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import Box from '@mui/material/Box';
import type { AccordionSummaryProps as MuiAccordionSummaryProps } from '@mui/material/AccordionSummary';
import type SvgIcon from '@mui/material/SvgIcon';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// TODO: should not force to use StartIcon
export interface AccordionSummaryProps extends MuiAccordionSummaryProps {
  StartIcon?: typeof SvgIcon | null;
}

export function AccordionSummary({
  children,
  expandIcon = <ExpandMoreIcon />,
  StartIcon = HexagonOutlinedIcon,
  ...rest
}: AccordionSummaryProps) {
  return (
    <MuiAccordionSummary {...rest} expandIcon={expandIcon}>
      <Box display="flex" alignItems="center">
        {StartIcon != null ? (
          <Box display="flex" alignItems="center" sx={{ mr: 1 }}>
            <StartIcon fontSize="small" />
          </Box>
        ) : null}
        {children}
      </Box>
    </MuiAccordionSummary>
  );
}

export default AccordionSummary;
