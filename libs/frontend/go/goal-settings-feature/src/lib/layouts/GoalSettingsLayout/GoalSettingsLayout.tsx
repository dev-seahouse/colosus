import { Box, Container, Toolbar, Typography, styled } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';
import type { GoalType } from '@bambu/go-core';
import { ProgressBar } from '@bambu/go-core';
import { Outlet } from 'react-router-dom';

import PrimaryGoalIcon from '../../components/icons/PrimaryGoalIcon/PrimaryGoalIcon';

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    backgroundColor: theme.palette.background.default,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
  },
}));

export interface GoalSettingsLayoutProps extends PropsWithChildren {
  goalType?: GoalType;
  title: string;
}

export function GoalSettingsLayout({
  children = <Outlet />,
  goalType = 'Other',
  title = 'I have another goal in mind',
}: GoalSettingsLayoutProps) {
  return (
    <StyledWrapper>
      <ProgressBar />
      <Toolbar sx={{ gap: 2 }}>
        <PrimaryGoalIcon goalType={goalType} fontSize="medium" />
        <Typography>{title}</Typography>
      </Toolbar>

      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="md">{children}</Container>
      </Box>
    </StyledWrapper>
  );
}

export default GoalSettingsLayout;
