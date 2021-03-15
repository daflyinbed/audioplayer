import {
  makeStyles,
  Theme,
  IconButton,
  Toolbar,
  Typography,
  Slider,
  createStyles,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";
import RepeatIcon from "@material-ui/icons/Repeat";
import {
  Audio,
  AudioControl,
  PlayerAction,
  PlayState,
} from "../hooks/useAudio";
import { Grid } from "@material-ui/core";
import { random, sec2str } from "../utils";
import { VolControl } from "./VolControl";
import { useSensor } from "../hooks/useSensor";
import { useRecoilState } from "recoil";
import { Order, PlayOrderState } from "../atoms/order";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
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
function PlayButton(props: { audio: Audio; disabled: boolean }) {
  const { audio, disabled } = props;
  const { state, control } = audio;
  switch (state) {
    case PlayState.Loading:
      return (
        <IconButton color="inherit" disabled={disabled}>
          <CircularProgress color="inherit" size={32} />
        </IconButton>
      );
    case PlayState.Playing:
      return (
        <IconButton
          color="inherit"
          disabled={disabled}
          onClick={() => {
            control({ type: PlayerAction.pause });
          }}
        >
          <PauseIcon />
        </IconButton>
      );
    case PlayState.Paused:
      return (
        <IconButton
          color="inherit"
          disabled={disabled}
          onClick={() => {
            control({ type: PlayerAction.play });
          }}
        >
          <PlayArrowIcon />
        </IconButton>
      );
    case PlayState.Idle:
      return (
        <IconButton color="inherit" disabled>
          <PlayArrowIcon />
        </IconButton>
      );
    default:
      return (
        <IconButton color="inherit" disabled={disabled}>
          <PlayArrowIcon />
        </IconButton>
      );
  }
}
function PlayOrder(props: { ac: AudioControl }) {
  const { ac } = props;
  const [playOrder, setPlayOrder] = useRecoilState(PlayOrderState);
  useSensor("AudioControl", ac);
  /*
  useEffect(() => {
    console.log("reset cb");
    switch (pl.order) {
      case Order.all:
        ac({
          type: PlayerAction.changeOnEnd,
          cb: () => {
            pl.control({
              type: PlaylistAction.jump,
              p: pl.cur + 1 < pl.list.length ? pl.cur + 1 : 0,
            });
          },
        });
        break;
      case Order.random:
        ac({
          type: PlayerAction.changeOnEnd,
          cb: () => {
            pl.control({
              type: PlaylistAction.jump,
              p: random(pl.list.length),
            });
          },
        });
        break;
      case Order.one:
        ac({
          type: PlayerAction.changeLoop,
          isLoop: true,
        });
    }
  }, [ac, pl]);
  */
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
export function WidePlayerBar(props: { audio: Audio }) {
  const classes = useStyles();
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  let audio = props.audio;
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
    audio.control({ type: PlayerAction.unload });
    audio.control({
      type: PlayerAction.load,
      src: playlist.list[playlist.cur].src as string,
    });
  }, [audio, playlist.cur, playlist.list]);
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
      <PlayButton audio={audio} disabled={playlist.list.length === 0} />
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
          <Typography variant="body2" color="inherit">
            {`${sec2str(audio.process)}/${sec2str(audio.len)}`}
          </Typography>
        </Grid>
        <Slider
          color="secondary"
          value={audio.process}
          min={0}
          max={audio.len}
          onChange={(_, v) => {
            audio.control({ type: PlayerAction.process, process: v as number });
          }}
        />
      </Grid>
      <VolControl audio={audio} />
      <PlayOrder ac={audio.control} />
    </Toolbar>
  );
}
