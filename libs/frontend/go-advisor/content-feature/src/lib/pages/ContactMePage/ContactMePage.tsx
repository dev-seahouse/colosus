import { BackButton, Grid } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import ContactMeForm from '../../components/ContactMeForm/ContactMeForm';
import QualifiedLeadsDialog from '../../components/QualifiedLeadsDialog/QualifiedLeadsDialog';

export function ContactMePage() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <BackButton label="All Content" />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Heading
              title="Reasons to contact"
              subtitle={
                <>
                  Share your unique selling propositions to convince your
                  clients to invest their money with you. This content will only
                  be shown to clients who qualify for your advice.
                  <QualifiedLeadsDialog />
                </>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <ContactMeForm />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ContactMePage;
