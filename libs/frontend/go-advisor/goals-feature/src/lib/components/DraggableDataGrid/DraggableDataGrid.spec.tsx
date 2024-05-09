// @vitest-environment jsdom
import { render, screen, userEvent } from '@bambu/react-test-utils';
import { DraggableDataGridExample } from './stories/DraggableDataGridExample';

describe('DraggableDataGrid', async () => {
  it('should render successfully', () => {
    render(<DraggableDataGridExample />);
  });

  test('data cells should be visible', () => {
    render(<DraggableDataGridExample />);
    for (let i = 1; i <= 3; i += 1) {
      expect(screen.getByText(`row ${i} data 1`)).toBeVisible();
      expect(screen.getByText(`row ${i} data 2`)).toBeVisible();
    }
  });

  test.skip('when row is focused style should be applied', async () => {
    const user = userEvent.setup();
    render(<DraggableDataGridExample />);
    const dragStartRow = screen.getByRole('button', {
      name: /row 1 data 1/i,
    });
    await user.tab();
    expect(dragStartRow).toHaveFocus();
    const computedStyle = window.getComputedStyle(dragStartRow);
    expect(computedStyle.border).toBe('2px solid #dcdcdc');

    await user.keyboard('{Space}');

    expect(
      await screen.findByText(/press space bar to start a drag./i)
    ).toBeInTheDocument();

    // TODO: userEvent.keyboard("{space}") is currently bugged & could not trigger space
  });
});
