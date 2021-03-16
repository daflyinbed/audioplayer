import { atom } from "recoil";
import { HowlContainer } from "../audio";
export enum PlayerState {
  Idle,
  Loading,
  Playing,
  Paused,
}
export const AudioState = atom({
  key: "audioState",
  default: PlayerState.Idle,
});
export const VolState = atom({
  key: "volState",
  default: 100,
});
export const MuteState = atom({
  key: "muteState",
  default: false,
});
// export const LoopState = atom({
//   key: "loopState",
//   default: false,
// });
export const ProcessState = atom({
  key: "processState",
  default: 0,
});
function getLen() {
  return HowlContainer.get()?.duration() || 0;
}
function play() {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.play();
}
function pause() {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.pause();
}
function vol(vol: number) {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.volume(vol / 100);
}
function mute(isMute: boolean) {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.mute(isMute);
}
function loop(isLoop: boolean) {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  if (isLoop) {
    howl.off("end");
  }
  howl.loop(isLoop);
}
function process(process: number) {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.seek(process);
}
function changeCB(cb: () => void) {
  let howl = HowlContainer.get();
  if (!howl) {
    return;
  }
  howl.loop(false);
  howl.off("end");
  howl.on("end", cb);
}
const HowlHelper = {
  getLen,
  play,
  pause,
  process,
  vol,
  mute,
  loop,
  changeCB,
};
export { HowlHelper };
