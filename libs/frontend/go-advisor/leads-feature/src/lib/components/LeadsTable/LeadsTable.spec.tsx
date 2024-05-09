import LeadsTable from './LeadsTable';
import { render } from '@bambu/react-test-utils';

describe('LeadsTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <LeadsTable
        columns={[]}
        data={[]}
        pageCount={0}
        pagination={{
          pageSize: 10,
          pageIndex: 0,
        }}
        totalCount={20}
        onPaginationChange={vi.fn}
        globalFilter={''}
        onGlobalFilterChange={vi.fn}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
