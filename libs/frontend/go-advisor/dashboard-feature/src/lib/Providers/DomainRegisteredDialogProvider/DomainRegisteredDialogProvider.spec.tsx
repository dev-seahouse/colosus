import { render, screen } from '@bambu/react-test-utils';
import DomainRegisteredDialogProvider from './DomainRegisteredDialogProvider';

describe('DomainRegisteredDialogProvider', () => {
  it('should render domain registered dialog if URL has domain_registered param === true', () => {
    render(<DomainRegisteredDialogProvider />, {
      path: '/?domain_registered=true',
    });

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
