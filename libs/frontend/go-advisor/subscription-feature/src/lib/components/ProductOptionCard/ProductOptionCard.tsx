import { Card, Box, Typography, Radio, styled } from '@bambu/react-ui';
import { NumericFormat } from 'react-number-format';
import type { RadioProps } from '@bambu/react-ui';

interface StyledCardProps {
  selected?: boolean;
  disabled?: boolean;
}

const StyledCard = styled(Card)<StyledCardProps>(
  ({ theme, selected = false, disabled = false }) => ({
    color: theme.palette.primary.main,
    ...(selected && {
      borderColor: theme.palette.primary.main,
      backgroundColor: 'transparent',
    }),
    ...(disabled && {
      color: theme.palette.text.disabled,
    }),
  })
);

export interface ProductOptionCardProps extends Omit<RadioProps, 'checked'> {
  productName: string;
  productPrice: number;
  productDescription: string;
  selected?: RadioProps['checked'];
  currency?: string;
}

export function ProductOptionCard({
  productName = 'Product Name',
  productPrice = 0,
  productDescription = 'Product description here',
  selected = false,
  disabled,
  currency = 'US$',
  ...rest
}: ProductOptionCardProps) {
  return (
    <StyledCard variant="outlined" disabled={disabled} selected={selected}>
      <Box
        display="flex"
        alignItems="center"
        sx={{ pt: 3, pb: 3, pl: 2, pr: 2 }}
      >
        <Box sx={{ mr: 2 }}>
          <Radio checked={selected} disabled={disabled} {...rest} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          sx={{ minHeight: 180 }}
        >
          <Box>
            <Typography
              color="inherit"
              sx={{ fontSize: '1.375rem', fontWeight: 700 }}
            >
              {productName}
            </Typography>
            {!disabled && (
              <Typography
                data-testid="product-price"
                color="inherit"
                sx={{ fontSize: '1.375rem', fontWeight: 700 }}
              >
                <NumericFormat
                  value={productPrice}
                  displayType="text"
                  prefix={currency}
                  suffix="/mo"
                  decimalScale={0}
                  fixedDecimalScale
                />
              </Typography>
            )}
            <Typography color={disabled ? 'text.disabled' : 'text.primary'}>
              {productDescription}
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
}

export default ProductOptionCard;
