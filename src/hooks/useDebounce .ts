import { useCallback, useEffect, useRef } from "react";

export function useDebounce(
  func: () => void,
  wait: number,
  immediate = false
) {
  let timeout = useRef<number | undefined>();
  const cb = useRef(func);
  useEffect(() => {
    cb.current = func;
  }, [func]);
  const cancel = useCallback(() => {
    timeout.current && window.clearTimeout(timeout.current);
  }, []);
  function resDebounced() {
    cancel();
    if (immediate) {
      const callNow = !timeout.current;
      timeout.current = window.setTimeout(() => {
        timeout.current = undefined;
      }, wait);
      if (callNow) {
        func();
      }
    } else {
      timeout.current = window.setTimeout(() => {
        timeout.current = undefined;
        func();
      }, wait);
    }
  }
  resDebounced.cancel = function () {
    cancel();
    timeout.current = undefined;
  };
  return useCallback(resDebounced, [wait, cancel, immediate, func]);
}
