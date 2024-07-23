import { useEffect, useState } from "react";

export const useDebounce = (value: string, ms: number) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, ms);
    return () => {
      clearTimeout(timer);
    };
  }, [value, ms]);

  return debouncedValue;
};

type F = (...args: any[]) => void;

export function debounce(fn: F, ms: number): F {
  let timerID: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timerID);
    timerID = setTimeout(fn, ms, ...args);
  };
}
