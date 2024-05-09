import { Heading } from '@bambu/go-core';
import { Stack } from '@bambu/react-ui';
import ManageClients from '../../components/ManageClients/ManageClients';

/* eslint-disable-next-line */
export interface ClientsPageProps {}
export function ClientsPage(props: ClientsPageProps) {
  return (
    <Stack spacing={4}>
      <Heading title="Clients" />
      <ManageClients />
    </Stack>
  );
}
export default ClientsPage;
