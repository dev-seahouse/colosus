import { render } from '@testing-library/react';

import GoalSettingsFormHeader from './GoalSettingsFormHeader';
import { BooksIcon } from '../../icons/BooksIcon';

describe('GoalSettingsFormHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <GoalSettingsFormHeader title="hello" Icon={BooksIcon} />
    );
    expect(baseElement).toBeTruthy();
  });
});
