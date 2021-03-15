export {}
// import { useReducer } from "react";
// import { useSensor } from "./useSensor";

// export interface Playlist {
//   playlist: playlistState;
//   playlistDispatch: React.Dispatch<action>;
// }
// export enum Order {
//   one,
//   all,
//   random,
// }
// export enum PlaylistAction {
//   insert,
//   insertAndJump,
//   remove,
//   next,
//   prev,
//   jump,
//   changeOrder,
// }
// export interface insert {
//   type: PlaylistAction.insert;
//   meta: AudioMeta;
//   p?: number;
// }
// export interface insertAndJump {
//   type: PlaylistAction.insertAndJump;
//   meta: AudioMeta;
//   p: number;
// }
// export interface remove {
//   type: PlaylistAction.remove;
//   p: number;
// }
// export interface next {
//   type: PlaylistAction.next;
// }
// export interface prev {
//   type: PlaylistAction.prev;
// }
// export interface jump {
//   type: PlaylistAction.jump;
//   p: number;
// }
// export interface changeOrder {
//   type: PlaylistAction.changeOrder;
//   order: Order;
// }
// export interface AudioMeta {
//   name: string;
//   src: string;
// }
// type action = insert | insertAndJump | remove | next | prev | jump;
// interface playlistState {
//   list: AudioMeta[];
//   cur: number;
// }
// export type PlaylistControl = (action: action) => void;
// function findAudio(audio: AudioMeta[], name: string) {
//   return audio.findIndex((v) => v.name === name);
// }
// export function usePlaylist(): Playlist {
//   const [playlist, playlistDispatch] = useReducer(
//     (state: playlistState, action: action) => {
//       let arr = [];
//       switch (action.type) {
//         case PlaylistAction.insert:
//           if (findAudio(state.list, action.meta.name) !== -1) {
//             return state;
//           }
//           arr = [...state.list];
//           arr.splice(action.p ?? state.list.length, 0, action.meta);
//           return {
//             list: arr,
//             cur: state.cur,
//           };
//         case PlaylistAction.insertAndJump:
//           let index = findAudio(state.list, action.meta.name);
//           if (index === -1) {
//             arr = [...state.list];
//             arr.splice(action.p, 0, action.meta);
//             return {
//               list: arr,
//               cur: action.p,
//             };
//           } else {
//             return {
//               list: state.list,
//               cur: index,
//             };
//           }
//         case PlaylistAction.remove:
//           arr = [...state.list];
//           arr.splice(action.p, 1);
//           if (action.p < state.cur) {
//             return {
//               list: arr,
//               cur: state.cur - 1,
//             };
//           } else {
//             return {
//               list: arr,
//               cur: state.cur,
//             };
//           }
//         case PlaylistAction.next:
//           return {
//             list: state.list,
//             cur: state.cur + 1,
//           };
//         case PlaylistAction.prev:
//           return {
//             list: state.list,
//             cur: state.cur - 1,
//           };
//         case PlaylistAction.jump:
//           return {
//             list: state.list,
//             cur: action.p,
//           };
//       }
//     },
//     {
//       list: [],
//       cur: -1,
//     }
//   );
//   return {
//     playlist,
//     playlistDispatch,
//   };
//   /*
//   // const [playlist, setPlaylist] = useState<AudioMeta[]>([]);
//   // const [cur, setCur] = useState(-1);
//   // const [order, setOrder] = useState(Order.all);
//   // const control = (action: action) => {
//   //   let arr = [];
//   //   switch (action.type) {
//   //     case PlaylistAction.insert:
//   //       if (playlist.findIndex((v) => v.name === action.meta.name) !== -1) {
//   //         return;
//   //       }
//   //       arr = [...playlist];
//   //       arr.splice(action.p ?? playlist.length, 0, action.meta);
//   //       setPlaylist(arr);
//   //       break;
//   //     case PlaylistAction.insertAndJump:
//   //       let index = playlist.findIndex((v) => v.name === action.meta.name);
//   //       if (index === -1) {
//   //         arr = [...playlist];
//   //         arr.splice(action.p, 0, action.meta);
//   //         setPlaylist(arr);
//   //         setCur(action.p);
//   //       } else {
//   //         setCur(index);
//   //       }
//   //       break;
//   //     case PlaylistAction.remove:
//   //       arr = [...playlist];
//   //       arr.splice(action.p, 1);
//   //       if (action.p < cur) {
//   //         setCur(cur - 1);
//   //       }
//   //       setPlaylist(arr);
//   //       break;
//   //     case PlaylistAction.next:
//   //       setCur(cur + 1);
//   //       break;
//   //     case PlaylistAction.prev:
//   //       setCur(cur - 1);
//   //       break;
//   //     case PlaylistAction.jump:
//   //       setCur(action.p);
//   //       break;
//   //     case PlaylistAction.changeOrder:
//   //       setOrder(action.order);
//   //       break;
//   //   }
//   // };
//   let cb = useCallback(control, [cur, playlist]);
//   useSensor("inner playlist", playlist);
//   useSensor("inner cur", cur);
//   useSensor("inner order", order);
//   useSensor("inner PlaylistControl", cb);
//   */
// }
