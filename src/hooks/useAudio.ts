import { useEffect, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  BufferedDuration,
  BufferedDurationState,
  CurTimeState,
  DurationState,
  EndState,
  LoadEnum,
  LoadState,
  LoopState,
  MuteState,
  PlayState,
  SeekState,
  SrcState,
  VolState,
} from "../atoms/audio";

function parseTimeRanges(ranges: TimeRanges) {
  const result: BufferedDuration[] = [];

  for (let i = 0; i < ranges.length; i++) {
    result.push({
      start: ranges.start(i),
      end: ranges.end(i),
    });
  }

  return result;
}

export function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playState, setPlayState] = useRecoilState(PlayState);
  const volState = useRecoilValue(VolState);
  const muteState = useRecoilValue(MuteState);
  const setBufferedDurationState = useSetRecoilState(BufferedDurationState);
  const [loadState, setLoadState] = useRecoilState(LoadState);
  const setDurationState = useSetRecoilState(DurationState);
  const loopState = useRecoilValue(LoopState);
  const setCurTimeState = useSetRecoilState(CurTimeState);
  const seekState = useRecoilValue(SeekState);
  const srcState = useRecoilValue(SrcState);
  const setEndState = useSetRecoilState(EndState);
  useEffect(() => {
    let audio = new Audio();
    audio.controls = false;
    audio.autoplay = true;
    ref.current = audio;
  }, []);

  // onPlay
  let onPlay = useCallback(() => {
    setPlayState(true);
  }, [setPlayState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.onplay = onPlay;
  }, [onPlay]);

  // onPause
  let onPause = useCallback(() => {
    setPlayState(false);
  }, [setPlayState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.onpause = onPause;
  }, [onPause]);

  // onEnded
  let onEnded = useCallback(() => {
    setEndState(true);
  }, [setEndState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.onended = onEnded;
  }, [onEnded]);

  // onProgress
  let onProgress = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    let duration = parseTimeRanges(el.buffered);
    setBufferedDurationState(duration);
  }, [setBufferedDurationState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.onprogress = onProgress;
  }, [onProgress]);

  // onCanPlay
  let onCanPlay = useCallback(() => {
    if (loadState !== LoadEnum.CanPlay) {
      setLoadState(LoadEnum.CanPlay);
    }
  }, [loadState, setLoadState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.oncanplay = onCanPlay;
  }, [onCanPlay]);

  // onDurationChange
  const onDurationChange = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const { duration, buffered } = el;
    setBufferedDurationState(parseTimeRanges(buffered));
    setDurationState(duration);
  }, [setBufferedDurationState, setDurationState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.ondurationchange = onDurationChange;
  }, [onDurationChange]);

  // onTimeUpdate
  const onTimeUpdate = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    setCurTimeState(el.currentTime);
  }, [setCurTimeState]);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.ontimeupdate = onTimeUpdate;
  }, [onTimeUpdate]);

  // play pause
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (playState) {
      el.play();
    } else {
      el.pause();
    }
  }, [playState]);

  // change vol
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.volume = volState / 100;
  }, [volState]);

  // mute unmute
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.muted = muteState;
  }, [muteState]);

  // seek
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.currentTime = seekState;
  }, [seekState]);

  // loop
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.loop = loopState;
  }, [loopState]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.src = srcState;
  }, [srcState]);
}
