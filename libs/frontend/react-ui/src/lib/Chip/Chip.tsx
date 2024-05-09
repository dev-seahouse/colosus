import MuiChip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

export const Chip = styled(MuiChip)(({ theme }) => ({
  '&.MuiChip-root': {
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: '0.75rem',
    minHeight: 32,
  },
  '& .MuiChip-iconSmall': {
    marginLeft: 4,
  },
}));

export default Chip;
