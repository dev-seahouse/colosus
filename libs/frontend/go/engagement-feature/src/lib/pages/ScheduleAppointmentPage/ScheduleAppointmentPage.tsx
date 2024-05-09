import { Container } from '@bambu/react-ui';
import { Header, useSelectAdvisorHasContactLink } from '@bambu/go-core';
import ScheduleAppointmentForm from '../../components/ScheduleAppointmentForm/ScheduleAppointmentForm';
import ScheduleAppointmentWithLinkForm from '../../components/ScheduleAppointmentWithLinkForm/ScheduleAppointmentWithLinkForm';

export function ScheduleAppointmentPage() {
  const { data: advisorHasContactLink } = useSelectAdvisorHasContactLink();

  return (
    <>
      <Header />
      <Container>
        {advisorHasContactLink ? (
          <ScheduleAppointmentWithLinkForm />
        ) : (
          <ScheduleAppointmentForm />
        )}
      </Container>
    </>
  );
}

export default ScheduleAppointmentPage;
