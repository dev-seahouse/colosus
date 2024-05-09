import MuiAvatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

export const Avatar = styled(MuiAvatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
})) as typeof MuiAvatar;

export default Avatar;
