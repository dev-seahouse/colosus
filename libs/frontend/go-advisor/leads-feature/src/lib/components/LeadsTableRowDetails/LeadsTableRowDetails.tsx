import { Box, Button, Grid } from '@bambu/react-ui';
import Drawer from '@mui/material/Drawer';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import type { CustomSections } from './componentFactory';
import { componentFactory } from './componentFactory';

import Section from './Section';
import Item from './Item';
import {
  useGetLeadsSummaryById,
  useUpdateLeadsSummaryStatus,
} from '@bambu/go-advisor-core';

import { useMemo } from 'react';
import SectionUserDetails from './SectionUserDetails';
import SectionContactDetails from './SectionContactDetails';
import { byKey } from './utils';

interface LeadsTableRowDetails {
  open: boolean;
  id: string;
  toggleDrawerOpen: () => void;
}

const customSections = {
  USER_DETAILS: SectionUserDetails,
  CONTACT_DETAILS: SectionContactDetails,
} satisfies CustomSections;

function LeadsStatusButton({
  userStatus,
  handleIHaveReviewedClick,
}: {
  userStatus: string | undefined;
  handleIHaveReviewedClick: () => void;
}) {
  return userStatus === 'NEW' ? (
    <Button type="button" onClick={handleIHaveReviewedClick}>
      I have reviewed this lead
    </Button>
  ) : (
    <Button
      type="button"
      variant="text"
      onClick={handleIHaveReviewedClick}
      startIcon={<HistoryIcon />}
    >
      Revert to "New" lead
    </Button>
  );
}
export function LeadsTableRowDetails({
  open,
  toggleDrawerOpen,
  id,
}: LeadsTableRowDetails) {
  const { mutate } = useUpdateLeadsSummaryStatus();
  const { data: leadsSummaryData } = useGetLeadsSummaryById({ id });
  const userStatus = leadsSummaryData
    ?.find(byKey('USER_DETAILS'))
    ?.fields.find(byKey('STATUS'))?.value;

  const make = useMemo(
    () =>
      componentFactory({
        sectionComponent: Section,
        itemComponent: Item,
        customSections,
        data: leadsSummaryData,
      }),
    [leadsSummaryData]
  );
  const handleIHaveReviewedClick = () =>
    mutate({
      id,
      status: userStatus === 'REVIEWED' ? 'NEW' : 'REVIEWED',
    });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawerOpen}
      PaperProps={{ style: { width: '600px' } }}
    >
      <Box
        sx={{
          height: '100%',
          backgroundColor: '#FFFFFF',
          marginTop: '64px',
          padding: '20px 30px',
        }}
        role="presentation"
      >
        <Grid container spacing={4} direction="column">
          <Grid item xs={12}>
            <Button
              type="button"
              onClick={toggleDrawerOpen}
              aria-label="close drawer"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              variant="text"
              sx={{ fontSize: '16px' }}
            >
              All Leads
            </Button>
          </Grid>
          <Grid item container xs={12} spacing={2}>
            {make()}
          </Grid>
          <Grid item xs={12}>
            <LeadsStatusButton
              userStatus={userStatus}
              handleIHaveReviewedClick={handleIHaveReviewedClick}
            />
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
}

export default LeadsTableRowDetails;
