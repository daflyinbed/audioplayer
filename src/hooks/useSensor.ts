import { useEffect } from "react";

export function useSensor(name: string, val: unknown) {
  useEffect(() => {
    console.log(`${name} changed`);
  }, [val]);
}
