import { Box, SxProps } from '@bambu/react-ui';
import { PropsWithChildren, ReactElement } from 'react';

type ChildType = ReactElement;
interface TwoColumnLayoutProps {
  children: [ChildType, ChildType];
  sx?: SxProps;
}
// this component uses css grid internally,
// it is used to solve the problem of elements not having consistent width
// if content length is different
// Example:
// <div>
//   <TwoColumLayout><Box width="100px">left content</Box></TwoColumLayout>
//
//
export function TwoColumnLayout({ children, sx }: TwoColumnLayoutProps) {
  return (
    <Box
      display={'grid'}
      gridTemplateColumns={'1fr 1fr'}
      alignItems="baseline"
      gap={'10px'}
      sx={sx}
    >
      {children}
    </Box>
  );
}

export default TwoColumnLayout;
