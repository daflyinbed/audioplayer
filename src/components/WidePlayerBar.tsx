import {
  makeStyles,
  Theme,
  IconButton,
  Toolbar,
  Typography,
  createStyles,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { VolControl } from "./VolControl";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import {
  PlayButton,
  ProcessText,
  ProcessSlider,
  PlayOrder,
} from "./AudioControls";
import { PlayOrderState, Order } from "../atoms/order";
import { random } from "../utils";
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

export function WidePlayerBar() {
  const classes = useStyles();
  const playOrder = useRecoilValue(PlayOrderState);
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  return (
    <Toolbar className={classes.root}>
      <IconButton
        color="inherit"
        onClick={() => {
          if (playOrder === Order.random) {
            setPlaylist((old) =>
              PlaylistHelper.jump(old, random(old.list.length, old.cur))
            );
          } else {
            setPlaylist((old) => PlaylistHelper.prev(old));
          }
        }}
        disabled={playOrder !== Order.random && playlist.cur === 0}
      >
        <SkipPreviousIcon />
      </IconButton>
      <PlayButton />
      <IconButton
        color="inherit"
        onClick={() => {
          if (playOrder === Order.random) {
            setPlaylist((old) =>
              PlaylistHelper.jump(old, random(old.list.length, old.cur))
            );
          } else {
            setPlaylist((old) => PlaylistHelper.next(old));
          }
        }}
        disabled={
          playOrder !== Order.random &&
          playlist.cur === playlist.list.length - 1
        }
      >
        <SkipNextIcon />
      </IconButton>
      <Grid item className={classes.controller}>
        <Grid container justify="space-between">
          <Typography variant="body2" color="inherit">
            {playlist.list[playlist.cur]?.name ?? ""}
          </Typography>
          <ProcessText />
        </Grid>
        <ProcessSlider />
      </Grid>
      <VolControl />
      <PlayOrder />
    </Toolbar>
  );
}
