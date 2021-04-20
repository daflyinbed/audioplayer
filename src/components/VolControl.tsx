import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import {
  createStyles,
  IconButton,
  makeStyles,
  Slider,
  Theme,
} from "@material-ui/core";
import { useRecoilState } from "recoil";
import { VolState, MuteState } from "../atoms/audio";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    volume: {
      width: 90,
      marginRight: theme.spacing(1),
    },
  })
);
export function VolControl(props: { small?: boolean }) {
  const classes = useStyles();
  const [volState, setVolState] = useRecoilState(VolState);
  const [muteState, setMuteState] = useRecoilState(MuteState);
  let small = props.small;
  return (
    <>
      <IconButton
        color="inherit"
        size={small ? "small" : "medium"}
        onClick={() => {
          setMuteState((old) => !old);
        }}
      >
        {muteState ? (
          <VolumeMuteIcon />
        ) : volState === 0 ? (
          <VolumeOffIcon />
        ) : (
          <VolumeUpIcon />
        )}
      </IconButton>
      <Slider
        color="secondary"
        className={classes.volume}
        value={volState}
        valueLabelDisplay="auto"
        disabled={muteState}
        min={0}
        max={100}
        step={1}
        onChange={(_, v) => {
          setVolState(v as number);
        }}
      />
    </>
  );
}
