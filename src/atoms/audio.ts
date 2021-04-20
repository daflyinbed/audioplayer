import { atom } from "recoil";
export interface BufferedDuration {
  start: number;
  end: number;
}
export enum LoadEnum {
  Idle,
  Loading,
  CanPlay, //浏览器已经可以播放媒体，但是预测已加载的数据不足以在不暂停的情况下顺利将其播放到结尾（即预测会在播放时暂停以获取更多的缓冲区内容）
  Err,
}
export const SrcState = atom({
  key: "srcState",
  default: "",
});
//已经加载的区间
export const BufferedDurationState = atom<BufferedDuration[]>({
  key: "bufferedDurationState",
  default: [],
});

//总长度
export const DurationState = atom({
  key: "audioDuration",
  default: -1,
});
export const LoadState = atom({
  key: "loadState",
  default: LoadEnum.Idle,
});

export const PlayState = atom({
  key: "playState",
  default: false,
});
export const VolState = atom({
  key: "volState",
  default: 100,
});
export const MuteState = atom({
  key: "muteState",
  default: false,
});
export const LoopState = atom({
  key: "loopState",
  default: false,
});
export const CurTimeState = atom({
  key: "curTimeState",
  default: 0,
});
export const SeekState = atom({
  key: "seekState",
  default: 0,
});
export const EndState = atom({
  key: "endState",
  default: false,
});