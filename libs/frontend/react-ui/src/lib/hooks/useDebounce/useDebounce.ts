import type { Dispatch } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { DebouncedState } from '../useDebouncedCallback/useDebouncedCallback';
import useDebouncedCallback from '../useDebouncedCallback/useDebouncedCallback';

function valueEquality<T>(left: T, right: T): boolean {
  return left === right;
}

function adjustFunctionValueOfSetState<T>(value: T): T | (() => T) {
  return typeof value === 'function' ? () => value : value;
}

function useStateIgnoreCallback<T>(initialState: T): [T, Dispatch<T>] {
  const [state, setState] = useState(
    adjustFunctionValueOfSetState(initialState)
  );
  const setStateIgnoreCallback = useCallback(
    (value: T) => setState(adjustFunctionValueOfSetState(value)),
    []
  );
  return [state, setStateIgnoreCallback];
}

export function useDebounce<T>(
  value: T,
  delay: number,
  options?: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
    equalityFn?: (left: T, right: T) => boolean;
  }
): [T, DebouncedState<(value: T) => void>] {
  const eq = (options && options.equalityFn) || valueEquality;

  const [state, dispatch] = useStateIgnoreCallback(value);
  const debounced = useDebouncedCallback(
    useCallback((value: T) => dispatch(value), [dispatch]),
    delay,
    options
  );
  const previousValue = useRef(value);

  if (!eq(previousValue.current, value)) {
    debounced(value);
    previousValue.current = value;
  }

  return [state, debounced];
}

export default useDebounce;
