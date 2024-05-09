import { render } from '@testing-library/react';

import ConfigurePortfolioForm from './ConfigurePortfolioForm';

describe('ConfigurePortfolioForm', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<ConfigurePortfolioForm />);
    expect(baseElement).toBeTruthy();
  });
});
