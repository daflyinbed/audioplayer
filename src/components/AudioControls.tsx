import {
  IconButton,
  CircularProgress,
  Typography,
  Slider,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AudioState,
  PlayerState,
  HowlHelper,
  ProcessState,
} from "../atoms/audio";
import { PlayOrderState, Order } from "../atoms/order";
import { PlaylistState, PlaylistHelper } from "../atoms/playlist";
import { HowlContainer } from "../audio";
import { useInterval } from "../hooks/useInterval";
import { random, sec2str } from "../utils";

import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import RepeatIcon from "@material-ui/icons/Repeat";

export function PlayButton(props: { small?: boolean }) {
  const [audioState, setAudioState] = useRecoilState(AudioState);
  let small = props.small;
  switch (audioState) {
    case PlayerState.Loading:
      return (
        <IconButton
          color="inherit"
          disabled={true}
          size={small ? "small" : "medium"}
        >
          <CircularProgress color="inherit" size={32} />
        </IconButton>
      );
    case PlayerState.Playing:
      return (
        <IconButton
          color="inherit"
          size={small ? "small" : "medium"}
          onClick={() => {
            HowlHelper.pause();
            setAudioState(PlayerState.Paused);
          }}
        >
          <PauseIcon />
        </IconButton>
      );
    case PlayerState.Paused:
      return (
        <IconButton
          color="inherit"
          size={small ? "small" : "medium"}
          onClick={() => {
            HowlHelper.play();
            setAudioState(PlayerState.Playing);
          }}
        >
          <PlayArrowIcon />
        </IconButton>
      );
    case PlayerState.Idle:
      return (
        <IconButton color="inherit" size={small ? "small" : "medium"} disabled>
          <PlayArrowIcon />
        </IconButton>
      );
  }
}
export function PlayOrder(props: { small?: boolean }) {
  const [playOrder, setPlayOrder] = useRecoilState(PlayOrderState);
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  let small = props.small;
  useEffect(() => {
    switch (playOrder) {
      case Order.all:
        if (playlist.list.length === 1) {
          HowlHelper.loop(true);
          return;
        }
        HowlHelper.changeCB(() => {
          setPlaylist((old) =>
            PlaylistHelper.jump(
              old,
              old.cur + 1 < old.list.length ? old.cur + 1 : 0
            )
          );
        });
        break;
      case Order.random:
        HowlHelper.changeCB(() => {
          setPlaylist((old) =>
            PlaylistHelper.jump(old, random(old.list.length))
          );
        });
        break;
      case Order.one:
        HowlHelper.loop(true);
    }
  }, [playOrder, setPlaylist, playlist]);
  switch (playOrder) {
    case Order.one:
      return (
        <IconButton
          onClick={() => {
            setPlayOrder(Order.all);
          }}
          edge="end"
          color="inherit"
          size={small ? "small" : "medium"}
        >
          <RepeatOneIcon />
        </IconButton>
      );
    case Order.all:
      return (
        <IconButton
          edge="end"
          size={small ? "small" : "medium"}
          color="inherit"
          onClick={() => {
            setPlayOrder(Order.random);
          }}
        >
          <RepeatIcon />
        </IconButton>
      );
    case Order.random:
      return (
        <IconButton
          edge="end"
          color="inherit"
          size={small ? "small" : "medium"}
          onClick={() => {
            setPlayOrder(Order.one);
          }}
        >
          <ShuffleIcon />
        </IconButton>
      );
  }
}
export function Process() {
  const [process, setProcess] = useRecoilState(ProcessState);
  useInterval(() => {
    let howl = HowlContainer.get();
    if (howl) {
      setProcess(howl.seek() as number);
    } else {
      setProcess(0);
    }
  }, 500);
  return (
    <Typography variant="body2" color="inherit">
      {`${sec2str(process)}/${sec2str(HowlHelper.getLen())}`}
    </Typography>
  );
}
export function ProcessSlider() {
  const [process, setProcess] = useRecoilState(ProcessState);
  const audioState = useRecoilValue(AudioState);
  return (
    <Slider
      color="secondary"
      value={process}
      min={0}
      max={HowlHelper.getLen()}
      disabled={audioState === PlayerState.Idle}
      onChange={(_, v) => {
        HowlHelper.process(v as number);
        setProcess(v as number);
        // audio.control({ type: PlayerAction.process, process: v as number });
      }}
    />
  );
}
