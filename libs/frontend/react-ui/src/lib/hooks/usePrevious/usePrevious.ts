import { useRef } from 'react';

type Nullable<T> = T | null;
export function usePrevious<T>(value: T, isEqualFn?: (a: T, b: T) => boolean) {
  const ref = useRef<{
    value: T;
    prev: Nullable<T>;
  }>({
    value: value,
    prev: value,
  });

  const current = ref.current.value;

  if (isEqualFn ? !isEqualFn(value, current) : value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
    return ref.current.value;
  }

  return ref.current.prev;
}
