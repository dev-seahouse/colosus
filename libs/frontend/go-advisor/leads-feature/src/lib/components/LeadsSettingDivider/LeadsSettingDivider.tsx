import { Box, styled } from '@bambu/react-ui';

const HorizontalLine = styled('div')({
  borderBottom: '1px solid black',
  opacity: 0.2,
  flex: '10 10 auto',
});

export function LeadsSettingDivider() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirecion: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      aria-hidden
    >
      <HorizontalLine />
      <Box sx={{ flex: '1 1 auto', textAlign: 'center' }}>OR</Box>
      <HorizontalLine />
    </Box>
  );
}

export default LeadsSettingDivider;
