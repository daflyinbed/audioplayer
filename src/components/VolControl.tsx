import { Audio, PlayerAction } from "../hooks/useAudio";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import React from "react";
import {
  createStyles,
  IconButton,
  makeStyles,
  Slider,
  Theme,
} from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    volume: {
      width: 90,
      marginRight: theme.spacing(1),
    },
  })
);
export function VolControl(props: { audio: Audio }) {
  const classes = useStyles();
  const { audio } = props;
  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => {
          audio.control({ type: PlayerAction.changeMute });
        }}
      >
        {audio.mute ? (
          <VolumeMuteIcon />
        ) : audio.vol === 0 ? (
          <VolumeOffIcon />
        ) : (
          <VolumeUpIcon />
        )}
      </IconButton>
      <Slider
        color="secondary"
        className={classes.volume}
        value={audio.vol}
        valueLabelDisplay="auto"
        disabled={audio.mute}
        min={0}
        max={100}
        step={1}
        onChange={(_, v) => {
          console.log(v);
          audio.control({ type: PlayerAction.changeVol, vol: v as number });
        }}
      />
    </>
  );
}
