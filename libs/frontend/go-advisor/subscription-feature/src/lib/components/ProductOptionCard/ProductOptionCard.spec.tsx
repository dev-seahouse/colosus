import { render, screen } from '@bambu/react-test-utils';
import ProductOptionCard from './ProductOptionCard';

const PRODUCT = {
  name: 'Product Name',
  price: 10,
  description: 'Product description here',
};
describe('ProductOptionCard', () => {
  it('should show product price if product is not disabled', () => {
    render(
      <ProductOptionCard
        productName={PRODUCT.name}
        productPrice={PRODUCT.price}
        productDescription={PRODUCT.description}
      />
    );

    expect(screen.getByTestId('product-price')).toBeDefined();
  });

  it('should hide product price if product is disabled', () => {
    render(
      <ProductOptionCard
        productName={PRODUCT.name}
        productPrice={PRODUCT.price}
        productDescription={PRODUCT.description}
        disabled
      />
    );

    expect(screen.queryByTestId('product-price')).toBeNull();
  });
});
