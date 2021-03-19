import { atom } from "recoil";
import { buildSrc } from "../utils";

interface playlistState {
  list: AudioMeta[];
  cur: number;
}
export interface AudioMeta {
  name: string;
  src: string;
}
const PlaylistState = atom<playlistState>({
  key: "playlist",
  default: {
    list: [],
    cur: -1,
  },
});
function buildMeta(name: string) {
  return {
    name,
    src: buildSrc(name),
  };
}
function findAudio(audio: AudioMeta[], name: string) {
  return audio.findIndex((v) => v.name === name);
}
function prev(old: playlistState): playlistState {
  return {
    ...old,
    cur: old.cur - 1,
  };
}
function next(old: playlistState): playlistState {
  return {
    ...old,
    cur: old.cur + 1,
  };
}
function insert(old: playlistState, name: string, p?: number): playlistState {
  if (findAudio(old.list, name) !== -1) {
    return old;
  }
  let arr = [...old.list];
  arr.splice(p ?? old.list.length, 0, buildMeta(name));
  return {
    ...old,
    list: arr,
  };
}
function remove(old: playlistState, p: number): playlistState {
  let { cur } = old;
  let arr = [...old.list];
  arr.splice(p, 1);
  if (p <= cur) {
    cur--;
  }
  return { list: arr, cur };
}
function removeAll(old: playlistState, p: Set<number>): playlistState {
  let { cur } = old;
  let offset = 0;
  let arr = old.list.filter((v, i) => {
    let has = p.has(i);
    if (has && i <= cur) {
      offset++;
    }
    return !has;
  });
  return {
    list: arr,
    cur: cur - offset,
  };
}
function jump(old: playlistState, p: number): playlistState {
  return {
    ...old,
    cur: p,
  };
}
function insertAndJump(
  old: playlistState,
  name: string,
  p: number
): playlistState {
  let index = findAudio(old.list, name);
  if (index === -1) {
    let arr = [...old.list];
    arr.splice(p, 0, buildMeta(name));
    return {
      list: arr,
      cur: p,
    };
  } else {
    return {
      ...old,
      cur: index,
    };
  }
}
const PlaylistHelper = {
  remove,
  removeAll,
  jump,
  prev,
  next,
  insert,
  insertAndJump,
};
export { PlaylistState, PlaylistHelper };
