import { Box } from '@bambu/react-ui';
import { lighten, styled, keyframes } from '@mui/material/styles';
import type { ComponentProps, ComponentType } from 'react';
import React from 'react';

/* Extract these into props if there are general use cases */
const NUM_DOTS = 8;
// determines how far the dots are from the center, and the size of the dots
const RADIUS = 12;
// the lower the number , the faster the spin
const ANIMATION_SPEED = '.74s';

const rotate = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
`;
const Dot = styled('span')<{ dotIndex: number }>(({ theme, dotIndex }) => ({
  width: '4px',
  height: '4px',
  left: `${RADIUS}px`,
  top: `${RADIUS}px`,
  position: 'absolute',
  backgroundColor: lighten(theme.palette.primary.main, 0.44),
  borderRadius: '50%',
  transform: `rotate(calc(${dotIndex} * (360deg / ${NUM_DOTS}))) translateY(${RADIUS}px)`,
  opacity: 0,
  animation: `${rotate} ${ANIMATION_SPEED} linear infinite`,
  animationDelay: `calc(${dotIndex} * (${ANIMATION_SPEED} / ${NUM_DOTS}))`,
}));

const makeDots = (
  count: number,
  Component: ComponentType<{ dotIndex: number }>
) =>
  Array.from({ length: count }, (_, index) => (
    <Component dotIndex={index + 1} />
  ));

const dots = makeDots(NUM_DOTS, Dot);
type CircularDotsLoaderProps = ComponentProps<typeof Box>;

export function CircularDotsLoader(props: CircularDotsLoaderProps) {
  return (
    <Box
      width={`${RADIUS * 2}px`}
      height={`${RADIUS * 2}px`}
      display="flex"
      position="relative"
      {...props}
      role="status"
      aria-label="loading"
      aria-live="polite"
      aria-busy="true"
    >
      {React.Children.toArray(dots)}
    </Box>
  );
}

export default CircularDotsLoader;
