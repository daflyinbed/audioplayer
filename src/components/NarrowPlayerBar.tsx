import {
  makeStyles,
  Theme,
  IconButton,
  Toolbar,
  Typography,
  createStyles,
} from "@material-ui/core";
import React from "react";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { Grid } from "@material-ui/core";
import { VolControl } from "./VolControl";
import { useRecoilState } from "recoil";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
import { PlayButton, ProcessText, ProcessSlider, PlayOrder } from "./AudioControls";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 1400,
      flexDirection: "column",
    },
  })
);
export function NarrowPlayerBar() {
  const classes = useStyles();
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  return (
    <Toolbar className={classes.root}>
      <Grid container justify="space-around">
        <IconButton
          color="inherit"
          size="small"
          onClick={() => {
            setPlaylist((old) => PlaylistHelper.prev(old));
          }}
          disabled={playlist.cur === 0}
        >
          <SkipPreviousIcon />
        </IconButton>
        <PlayButton small />
        <IconButton
          size="small"
          color="inherit"
          onClick={() => {
            setPlaylist((old) => PlaylistHelper.next(old));
          }}
          disabled={playlist.cur === playlist.list.length - 1}
        >
          <SkipNextIcon />
        </IconButton>
        <PlayOrder small />
        <VolControl small />
      </Grid>
      <Grid container justify="space-between">
        <Typography variant="body2" color="inherit">
          {playlist.list[playlist.cur]?.name ?? ""}
        </Typography>
        <ProcessText />
      </Grid>
      <ProcessSlider />
    </Toolbar>
  );
}
