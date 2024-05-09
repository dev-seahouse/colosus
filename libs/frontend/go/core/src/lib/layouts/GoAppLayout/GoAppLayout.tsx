import { Box } from '@bambu/react-ui';
import Header from '../../components/Header/Header';
import type { PropsWithChildren } from 'react';

/**
 * Groups children with App Header
 */
export function GoAppLayout({ children }: PropsWithChildren) {
  return (
    // Pb 2 adds spacing for localizeJS
    <Box pb={2}>
      <Header />
      <div id="app-bar" />
      {children}
    </Box>
  );
}

export default GoAppLayout;
