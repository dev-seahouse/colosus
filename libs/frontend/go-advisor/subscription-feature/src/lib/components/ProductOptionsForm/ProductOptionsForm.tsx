import { BackButton, Box, Button, Grid, Typography } from '@bambu/react-ui';
import { useEffect, useState } from 'react';
import type { Stripe } from 'stripe';

import { getInitialValue } from './ProductOptionsForm.utils';
import ProductOptionCard from '../ProductOptionCard/ProductOptionCard';
import { useSelectPricesQuery } from '../../hooks/useGetPrices/useGetPrices.selectors';
import useCreateCheckoutSession from '../../hooks/useCreateCheckoutSession/useCreateCheckoutSession';
import getSubscriptionAmount from '../../utils/getSubscriptionAmount/getSubscriptionAmount';
import { TransactSubscriptionDialog } from '../TransactSubscriptionDialog/TransactSubscriptionDialog';
import { useNavigate } from 'react-router-dom';

export function ProductOptionsForm() {
  const navigate = useNavigate();
  const { data: prices } = useSelectPricesQuery();
  const { mutate, isLoading } = useCreateCheckoutSession({
    onSuccess: (data) => {
      // redirect to external url
      window.location.href = data.url as string;
    },
  });
  const [selectedProduct, setSelectedProduct] = useState<null | string>(
    getInitialValue(prices)
  );
  const [isTransactSelected, setIsTransactSelected] = useState(false);
  const [
    displayTransactSubscriptionDialog,
    setDisplayTransactSubscriptionDialog,
  ] = useState(false);

  const transactDialogHandler = () =>
    setDisplayTransactSubscriptionDialog(!displayTransactSubscriptionDialog);

  const submitSubscriptionRequest = () => {
    if (selectedProduct) {
      mutate({ priceId: selectedProduct });
    }
  };

  useEffect(() => {
    const selectedProductData = prices?.filter((p) => p.id === selectedProduct);
    if (selectedProductData?.[0].metadata.bambuGoProductId === 'TRANSACT') {
      return setIsTransactSelected(true);
    } else {
      setIsTransactSelected(false);
    }
  }, [selectedProduct, prices, isTransactSelected]);

  const onSubmit = () =>
    isTransactSelected
      ? setDisplayTransactSubscriptionDialog(!displayTransactSubscriptionDialog)
      : submitSubscriptionRequest();

  return (
    <Grid spacing={4} container>
      <Grid item xs={12}>
        <BackButton onClick={() => navigate('/dashboard/home')} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h1"
          sx={{ fontSize: '2.8125rem' }}
          textAlign="center"
        >
          Subscribe to Bambu GO
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid spacing={2} container>
          {prices?.map((price) => {
            const product = price?.product as Stripe.Product;

            return (
              <Grid item xs={12} md={6} key={price.id}>
                <ProductOptionCard
                  inputProps={{
                    'aria-label': `Select ${product.name}`,
                  }}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  value={price.id}
                  selected={selectedProduct === price.id}
                  productName={product.name}
                  productPrice={getSubscriptionAmount(
                    price.unit_amount_decimal
                  )}
                  productDescription={product.description as string}
                  disabled={!product.active}
                  currency={price.currency.toUpperCase()}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-around">
          <Button isLoading={isLoading} onClick={onSubmit}>
            Subscribe
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" textAlign="center">
          You will be securely directed to Stripe to make payment.
        </Typography>
      </Grid>
      <TransactSubscriptionDialog
        open={displayTransactSubscriptionDialog}
        onClose={transactDialogHandler}
        submitSubscriptionRequest={submitSubscriptionRequest}
      />
    </Grid>
  );
}

export default ProductOptionsForm;
