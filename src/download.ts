// import axios from "axios";
// import { downloadListState, downloadState } from "./atoms/downloadList";
// import { AudioMeta } from "./atoms/playlist";
// export class Downloader {
//   private static instance: Downloader;
//   private downloadListState: downloadListState;
//   private one?: (index: number, name: string) => void;
//   private all?: () => void;
//   private process?: (index: number, name: string, process: number) => void;
//   // private onChange?: (index: number, status: downloadState) => void;
//   private fail?: (index: number) => void;
//   private isDownloading = false;
//   private constructor() {
//     this.downloadListState = {
//       list: [],
//       cur: -1,
//     };
//   }
//   public static get() {
//     if (Downloader.instance == null) {
//       Downloader.instance = new Downloader();
//     }
//     return Downloader.instance;
//   }
//   public add(meta: AudioMeta) {
//     this.downloadListState.list.push({
//       ...meta,
//       state: downloadState.waiting,
//       process: -1,
//     });
//   }
//   public remove(index: number) {
//     this.downloadListState.cur =
//       index < this.downloadListState.cur
//         ? this.downloadListState.cur - 1
//         : this.downloadListState.cur;
//     this.downloadListState.list.splice(index, 1);
//   }
//   public setOne(cb: (index: number, name: string) => void) {
//     this.one = cb;
//   }
//   public setAll(cb: () => void) {
//     this.all = cb;
//   }
//   public setProcess(
//     cb: (index: number, name: string, process: number) => void
//   ) {
//     this.process = cb;
//   }
//   public setFail(cb: (index: number) => void) {
//     this.fail = cb;
//   }
//   // public setOnChange(cb: (index: number, status: downloadState) => void) {
//   //   this.onChange = cb;
//   // }
//   public async start() {
//     if (this.isDownloading) {
//       return;
//     }
//     this.isDownloading = true;
//     await this.dl();
//     this.isDownloading = false;
//   }
//   private async dlOne(index: number, src: string) {
//     return axios({
//       url: src,
//       onDownloadProgress: (e: any) => {
//         console.log(e);
//       },
//       responseType: "arraybuffer",
//     }).catch((err: any) => {
//       console.log(err);
//       if (this.fail) {
//         this.fail(index);
//       }
//     });
//   }
//   private async dl() {
//     while (true) {
//       let state = this.downloadListState;
//       let cur = state.list[state.cur];
//       const resp = await this.dlOne(state.cur, cur.src);
//       if (resp) {
//         if (resp.status < 400 && resp.status >= 200) {
//           if (this.one) {
//             this.one(state.cur, cur.name);
//           }
//           let blob = new Blob([resp.data], { type: "audio/mpeg" });
//           let objectUrl = URL.createObjectURL(blob);
//           let ele = document.createElement("a");
//           ele.setAttribute("href", objectUrl);
//           ele.setAttribute("download", cur.name + ".mp3");
//           ele.click();
//         }
//       }
//       if (state.cur === this.downloadListState.list.length - 1) {
//         if (this.all) {
//           this.all();
//         }
//         return;
//       }
//       state.cur++;
//     }
//   }
// }
export {}