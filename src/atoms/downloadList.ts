import { atom } from "recoil";
// import { Downloader } from "../download";
// import { AudioMeta } from "./playlist";
// export interface downloadListState {
//   list: DownloadAudio[];
//   cur: number;
// }
// interface DownloadAudio extends AudioMeta {
//   state: downloadState;
//   process: number;
// }
// export enum downloadState {
//   downloading,
//   downloaded,
//   failed,
//   waiting,
// }
// export const DownloadListState = atom<downloadListState>({
//   key: "downloadListState",
//   default: { list: [], cur: -1 },
// });
// function add(old: downloadListState, audio: AudioMeta): downloadListState {
//   Downloader.get().add(audio);
//   return {
//     cur: old.cur,
//     list: [
//       ...old.list,
//       { ...audio, state: downloadState.waiting, process: -1 },
//     ],
//   };
// }
// function remove(old: downloadListState, index: number): downloadListState {
//   Downloader.get().remove(index);
//   let arr = [...old.list];
//   arr.splice(index, 1);
//   if (index < old.cur) {
//   }
//   return {
//     list: arr,
//     cur: index < old.cur ? old.cur - 1 : old.cur,
//   };
// }
// const DownloadListHelper = { add, remove };
// export { DownloadListHelper };
export const DownloadListState = atom<string[]>({
  key: "downloadList",
  default: [],
});
export const DownloadListOpen = atom({
  key: "downloadListOpen",
  default: false,
});
