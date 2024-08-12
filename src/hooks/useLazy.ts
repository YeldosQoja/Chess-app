import { useRef } from "react";

export const useLazy = <T>(createInstance: () => T) => {
  const ref = useRef<T>(null);

  if (ref.current === null) {
    // @ts-ignore
    ref.current = createInstance();
  }

  return ref.current;
};
