import { render } from '@bambu/react-test-utils';

import ProductRecommendationTabs from './ProductRecommendationTabs';

describe('ProductRecommendationTabs', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<ProductRecommendationTabs />);
    expect(baseElement).toBeTruthy();
  });
});
