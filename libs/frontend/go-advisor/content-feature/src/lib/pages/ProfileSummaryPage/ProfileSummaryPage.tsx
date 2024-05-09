import { Grid, BackButton } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';

import ProfileSummaryForm from '../../components/ProfileSummaryForm/ProfileSummaryForm';
import QualifiedLeadsDialog from '../../components/QualifiedLeadsDialog/QualifiedLeadsDialog';

export function ProfileSummaryPage() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <BackButton label="All Content" />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Heading
              title="Advisor profile"
              subtitle={
                <>
                  Tell your clients about who you are, what you do and what you
                  can offer them.
                  <br /> Your profile will only be shown to clients who qualify
                  for your advice. <QualifiedLeadsDialog />
                </>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <ProfileSummaryForm />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfileSummaryPage;
