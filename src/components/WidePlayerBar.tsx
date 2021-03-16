import {
  makeStyles,
  Theme,
  IconButton,
  Toolbar,
  Typography,
  Slider,
  createStyles,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import RepeatIcon from "@material-ui/icons/Repeat";
import { Grid } from "@material-ui/core";
import { random, sec2str } from "../utils";
import { VolControl } from "./VolControl";
import { useSensor } from "../hooks/useSensor";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Order, PlayOrderState } from "../atoms/order";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
import {
  AudioState,
  HowlHelper,
  PlayerState,
  ProcessState,
} from "../atoms/audio";
import { useInterval } from "../hooks/useInterval";
import { HowlContainer } from "../audio";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 1400,
    },
    controller: {
      flexGrow: 1,
    },
  })
);
function PlayButton() {
  const [audioState, setAudioState] = useRecoilState(AudioState);
  switch (audioState) {
    case PlayerState.Loading:
      return (
        <IconButton color="inherit" disabled={true}>
          <CircularProgress color="inherit" size={32} />
        </IconButton>
      );
    case PlayerState.Playing:
      return (
        <IconButton
          color="inherit"
          onClick={() => {
            // control({ type: PlayerAction.pause });
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
          onClick={() => {
            HowlHelper.play();
            setAudioState(PlayerState.Playing);
            // control({ type: PlayerAction.play });
          }}
        >
          <PlayArrowIcon />
        </IconButton>
      );
    case PlayerState.Idle:
      return (
        <IconButton color="inherit" disabled>
          <PlayArrowIcon />
        </IconButton>
      );
  }
}
function PlayOrder() {
  const [playOrder, setPlayOrder] = useRecoilState(PlayOrderState);
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
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
        >
          <RepeatOneIcon />
        </IconButton>
      );
    case Order.all:
      return (
        <IconButton
          edge="end"
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
          onClick={() => {
            setPlayOrder(Order.one);
          }}
        >
          <ShuffleIcon />
        </IconButton>
      );
  }
}
function Process() {
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
function ProcessSlider() {
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
        console.log(v);
        HowlHelper.process(v as number);
        setProcess(v as number);
        // audio.control({ type: PlayerAction.process, process: v as number });
      }}
    />
  );
}
export function WidePlayerBar() {
  const classes = useStyles();
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const setAudioState = useSetRecoilState(AudioState);
  const prevSrcRef = useRef<null | string>(null);
  useEffect(() => {
    if (
      playlist.list[playlist.cur] === null ||
      playlist.list[playlist.cur] === undefined
    ) {
      return;
    }
    if (prevSrcRef.current === playlist.list[playlist.cur].src) {
      return;
    }
    prevSrcRef.current = playlist.list[playlist.cur].src;
    console.log("src changed");
    HowlContainer.load(playlist.list[playlist.cur].src);
    setAudioState(PlayerState.Loading);
    HowlContainer.get()?.once("load", () => {
      HowlContainer.get()?.play();
      setAudioState(PlayerState.Playing);
    });
    HowlContainer.get()?.load();
  }, [playlist.cur, playlist.list, setAudioState]);
  return (
    <Toolbar className={classes.root}>
      <IconButton
        color="inherit"
        onClick={() => {
          setPlaylist((old) => PlaylistHelper.prev(old));
        }}
        disabled={playlist.cur === 0}
      >
        <SkipPreviousIcon />
      </IconButton>
      <PlayButton />
      <IconButton
        color="inherit"
        onClick={() => {
          setPlaylist((old) => PlaylistHelper.next(old));
        }}
        disabled={playlist.cur === playlist.list.length - 1}
      >
        <SkipNextIcon />
      </IconButton>
      <Grid item className={classes.controller}>
        <Grid container justify="space-between">
          <Typography variant="body2" color="inherit">
            {playlist.list[playlist.cur]?.name ?? ""}
          </Typography>
          <Process />
        </Grid>
        <ProcessSlider />
      </Grid>
      <VolControl />
      <PlayOrder />
    </Toolbar>
  );
}
