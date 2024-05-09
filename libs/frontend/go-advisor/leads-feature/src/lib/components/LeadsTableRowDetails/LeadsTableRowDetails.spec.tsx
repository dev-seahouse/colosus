import LeadsTableRowDetails from './LeadsTableRowDetails';
import { render } from '@bambu/react-test-utils';

describe('LeadsTableRowDetails', () => {
  it('LeadsTableRowDetails drawer should render successfully', () => {
    const { baseElement } = render(
      <LeadsTableRowDetails open={true} id="" toggleDrawerOpen={vi.fn} />
    );
    expect(baseElement).toBeTruthy();
  });
});
