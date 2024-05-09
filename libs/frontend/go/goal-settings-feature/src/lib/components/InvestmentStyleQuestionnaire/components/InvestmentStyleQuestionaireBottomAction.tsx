import { Box } from '@bambu/react-ui';
import { InvestmentStyleListAction, BottomAction } from '@bambu/go-core';

export function InvestmentStyleQuestionaireBottomAction() {
  return (
    <>
      <Box display={{ xs: 'none', md: 'flex', justifyContent: 'space-around' }}>
        <InvestmentStyleListAction fullWidth />
      </Box>

      <Box display={{ xs: 'block', md: 'none' }}>
        <BottomAction>
          <InvestmentStyleListAction fullWidth />
        </BottomAction>
      </Box>
    </>
  );
}
