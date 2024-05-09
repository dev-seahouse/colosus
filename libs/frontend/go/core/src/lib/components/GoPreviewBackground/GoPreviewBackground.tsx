import { styled } from '@bambu/react-ui';
export const GoPreviewBackground = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export default GoPreviewBackground;
