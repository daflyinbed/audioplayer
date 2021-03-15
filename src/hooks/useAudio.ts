import { Howl } from "howler";
import { useCallback, useRef, useState } from "react";
import { useInterval } from "./useInterval";
export enum PlayState {
  Idle,
  Loading,
  Loaded,
  Playing,
  Paused,
  Stopped,
}
export enum PlayerAction {
  load,
  play,
  pause,
  stop,
  changeVol,
  changeMute,
  changeLoop,
  process,
  unload,
  changeOnEnd,
}
export interface load {
  type: PlayerAction.load;
  src: string;
}
export interface play {
  type: PlayerAction.play;
}
export interface pause {
  type: PlayerAction.pause;
}
export interface stop {
  type: PlayerAction.stop;
}
export interface changeVol {
  type: PlayerAction.changeVol;
  vol: number;
}
export interface changeMute {
  type: PlayerAction.changeMute;
}
export interface changeLoop {
  type: PlayerAction.changeLoop;
  isLoop: boolean;
}
export interface process {
  type: PlayerAction.process;
  process: number;
}
export interface unload {
  type: PlayerAction.unload;
}
export interface changeOnEnd {
  type: PlayerAction.changeOnEnd;
  cb: () => void;
}
export interface Audio {
  control: AudioControl;
  state: PlayState;
  vol: number;
  mute: boolean;
  loop: boolean;
  process: number;
  len: number;
}
type action =
  | load
  | play
  | pause
  | stop
  | changeVol
  | changeMute
  | changeLoop
  | process
  | unload
  | changeOnEnd;
export type AudioControl = (action: action) => void;
export function useAudio(): Audio {
  const [state, setState] = useState(PlayState.Idle);
  const [vol, setVol] = useState(100);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [process, setProcess] = useState(0);
  const [len, setLen] = useState(0);
  const ref = useRef<Howl>();
  useInterval(() => {
    if (ref.current) {
      setProcess(Math.floor(ref.current.seek() as number));
    }
  }, 50);

  const change = (action: action) => {
    switch (action.type) {
      case PlayerAction.load:
        if (!ref.current) {
          console.log("load");
          ref.current = new Howl({ src: action.src, preload: "metadata" });
          setState(PlayState.Loading);
          ref.current.once("load", () => {
            ref.current?.play();
            console.log(ref.current);
            setState(PlayState.Playing);
            setLen(ref.current?.duration() || -1);
          });
        }
        ref.current.load();
        break;
      case PlayerAction.play:
        ref.current?.play();
        setState(PlayState.Playing);
        break;
      case PlayerAction.pause:
        ref.current?.pause();
        setState(PlayState.Paused);
        break;
      case PlayerAction.stop:
        ref.current?.stop();
        setProcess(0);
        setState(PlayState.Loaded);
        break;
      case PlayerAction.changeVol:
        let vol = action.vol === 0 ? 0 : action.vol;
        setVol(vol);
        ref.current?.volume(vol / 100);
        break;
      case PlayerAction.changeMute:
        ref.current?.mute(!mute);
        setMute(!mute);
        break;
      case PlayerAction.changeLoop:
        if (action.isLoop) {
          ref.current?.off("end");
        }
        ref.current?.loop(action.isLoop);
        setLoop(action.isLoop);
        break;
      case PlayerAction.process:
        setProcess(action.process);
        ref.current?.seek(action.process);
        break;
      case PlayerAction.unload:
        ref.current?.unload();
        ref.current = undefined;
        break;
      case PlayerAction.changeOnEnd:
        ref.current?.off("end");
        ref.current?.on("end", () => {
          action.cb();
        });
        ref.current?.loop(false);
        setLoop(false);
    }
  };
  return {
    control: useCallback(change, [mute]),
    vol,
    mute,
    state,
    loop,
    process,
    len,
  };
}
