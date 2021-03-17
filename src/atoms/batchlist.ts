import { atom } from "recoil";

export const BatchSearchSet = atom<Set<number>>({
  key: "batchSearchSet",
  default: new Set(),
});
