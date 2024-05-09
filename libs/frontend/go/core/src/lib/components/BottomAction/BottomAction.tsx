import { Paper, styled, Toolbar } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface BottomActionProps {
  children?: ReactNode;
}

const BottomActionContainer = styled(Toolbar)({
  position: 'fixed',
  width: '100%',
  bottom: 0,
  left: 0,
  display: 'block',
  paddingLeft: 0,
  paddingRight: 0,
});

/** @deprecated use BottomActionLayout instead */
export function BottomAction({
  children = <span>children goes here</span>,
}: BottomActionProps) {
  return (
    <BottomActionContainer className={'bottom-action'}>
      <Paper sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>{children}</Paper>
    </BottomActionContainer>
  );
}

export default BottomAction;
