import {
  IconButton,
  CircularProgress,
  Typography,
  Slider,
} from "@material-ui/core";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  PlayState,
  DurationState,
  LoopState,
  CurTimeState,
  LoadEnum,
  LoadState,
  SeekState,
} from "../atoms/audio";
import { PlayOrderState, Order } from "../atoms/order";
import { PlaylistState } from "../atoms/playlist";
import { sec2str } from "../utils";

import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import RepeatIcon from "@material-ui/icons/Repeat";

export function PlayButton(props: { small?: boolean }) {
  const loadState = useRecoilValue(LoadState);
  const [playState, setPlayState] = useRecoilState(PlayState);
  let small = props.small;
  if (loadState === LoadEnum.Idle) {
    return (
      <IconButton color="inherit" size={small ? "small" : "medium"} disabled>
        <PlayArrowIcon />
      </IconButton>
    );
  }
  if (loadState !== LoadEnum.CanPlay) {
    return (
      <IconButton
        color="inherit"
        disabled={true}
        size={small ? "small" : "medium"}
      >
        <CircularProgress color="inherit" size={32} />
      </IconButton>
    );
  }
  //在播放 点击之后暂停
  if (playState) {
    return (
      <IconButton
        color="inherit"
        size={small ? "small" : "medium"}
        onClick={() => {
          setPlayState(false);
        }}
      >
        <PauseIcon />
      </IconButton>
    );
  }
  //暂停 点击之后播放
  return (
    <IconButton
      color="inherit"
      size={small ? "small" : "medium"}
      onClick={() => {
        setPlayState(true);
      }}
    >
      <PlayArrowIcon />
    </IconButton>
  );
}
export function PlayOrder(props: { small?: boolean }) {
  const [playOrder, setPlayOrder] = useRecoilState(PlayOrderState);
  const playlist = useRecoilValue(PlaylistState);
  const setLoopState = useSetRecoilState(LoopState);
  let small = props.small;
  // 单曲循环相关的立刻处理 切歌的情况等到播完再处理
  useEffect(() => {
    switch (playOrder) {
      case Order.all:
        if (playlist.list.length === 1) {
          setLoopState(true);
          return;
        }
        setLoopState(false);
        break;
      case Order.random:
        setLoopState(false);
        break;
      case Order.one:
        setLoopState(true);
    }
  }, [playOrder, playlist.list.length, setLoopState]);
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
export function ProcessText() {
  const curTime = useRecoilValue(CurTimeState);
  const duration = useRecoilValue(DurationState);
  return (
    <Typography variant="body2" color="inherit">
      {`${sec2str(curTime)}/${sec2str(duration)}`}
    </Typography>
  );
}
export function ProcessSlider() {
  const curTime = useRecoilValue(CurTimeState);
  const setTime = useSetRecoilState(SeekState);
  const loadState = useRecoilValue(LoadState);
  const duration = useRecoilValue(DurationState);
  return (
    <Slider
      color="secondary"
      value={curTime}
      min={0}
      max={duration | 0}
      disabled={loadState !== LoadEnum.CanPlay}
      onChange={(_, v) => {
        setTime(v as number);
      }}
    />
  );
}
