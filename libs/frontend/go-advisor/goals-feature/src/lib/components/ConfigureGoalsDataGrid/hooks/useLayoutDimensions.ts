import type { CSSProperties } from 'react';
import {
  useLayoutEffect,
  useRef,
} from 'react';

export function useLayoutDimensions(condition: boolean | void) {
  const elementRef = useRef<HTMLElement>();
  const dimensionsRef = useRef<{
    width: CSSProperties['width'];
    height: CSSProperties['height'];
  }>();

  useLayoutEffect(() => {
    const shouldReturnEarly = () => {
      // not mounted
      if (!elementRef.current) return true;

      if (condition) return true;

      return false;
    };

    if (shouldReturnEarly()) {
      return;
    }

    // disabled because already checked
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const { width, height } = elementRef.current!.getBoundingClientRect();
    dimensionsRef.current = { width, height };
  }, [condition]);

  function getLockedDimensions() {
    // skip if component is not visible
    if (!dimensionsRef.current) return;

    const {
      current: { width, height },
    } = dimensionsRef;

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  return [elementRef, getLockedDimensions] as const;
}

export default useLayoutDimensions;
