import { Header } from '@bambu/go-advisor-core';
import { Box, Container } from '@bambu/react-ui';

import useGetPrices from '../../hooks/useGetPrices/useGetPrices';
import type { GetPricesData } from '../../hooks/useGetPrices/useGetPrices';
import ProductOptionsForm from '../../components/ProductOptionsForm/ProductOptionsForm';

export interface SelectSubscriptionPageProps {
  initialData?: {
    prices: GetPricesData;
  };
}

export function SelectSubscriptionPage({
  initialData,
}: SelectSubscriptionPageProps) {
  const { isInitialLoading } = useGetPrices({
    initialData: initialData?.prices,
  });

  return isInitialLoading ? null : (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        minHeight: '100vh',
        pt: 8,
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container sx={{ pt: 10 }} maxWidth="md">
          <ProductOptionsForm />
        </Container>
      </Box>
    </Box>
  );
}

export default SelectSubscriptionPage;
