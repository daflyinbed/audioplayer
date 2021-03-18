import { atom } from "recoil";

export const BatchSearchSet = atom<Set<number>>({
  key: "batchSearchSet",
  default: new Set(),
});
export const BatchPlaySet = atom<Set<number>>({
  key: "batchPlaySet",
  default: new Set(),
});
