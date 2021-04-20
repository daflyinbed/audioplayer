import { atom } from "recoil";
export const DownloadListState = atom<string[]>({
  key: "downloadList",
  default: [],
});
export const DownloadListOpen = atom({
  key: "downloadListOpen",
  default: false,
});
