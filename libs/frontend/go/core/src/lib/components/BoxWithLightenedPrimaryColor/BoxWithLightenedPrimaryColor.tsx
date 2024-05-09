import { Box, styled, lighten } from '@bambu/react-ui';

export const BoxWithLightenedPrimaryColor = styled(Box)(({ theme }) => ({
  backgroundColor: lighten(theme.palette.primary.main, 0.8),
}));

export default BoxWithLightenedPrimaryColor;
