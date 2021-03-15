import {
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { PlaylistState, PlaylistHelper } from "../atoms/playlist";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ClearIcon from "@material-ui/icons/Clear";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import React from "react";
import { useMenu } from "../hooks/useMenu";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: "100%",
      height: "100%",
    },
  })
);
function Row(props: ListChildComponentProps) {
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const { index, style, data } = props;
  const size: boolean = data.size;
  const onMenuClick = data.onMenuClick;
  // console.log("playlist size", list.length);
  return (
    <ListItem
      ContainerProps={{ style: style }}
      button
      key={index}
      selected={playlist.cur === index}
      onClick={() => {
        setPlaylist((old) => PlaylistHelper.jump(old, index));
      }}
    >
      <ListItemText
        primaryTypographyProps={{ variant: size ? "body1" : "body2" }}
      >
        {playlist.list[index].name}
      </ListItemText>
      <ListItemSecondaryAction>
        {size ? (
          <IconButton
            onClick={(e) => {
              setPlaylist((old) => PlaylistHelper.remove(old, index));
            }}
          >
            <ClearIcon></ClearIcon>
          </IconButton>
        ) : null}
        <IconButton
          onClick={(e) => {
            onMenuClick(e.currentTarget, index);
          }}
        >
          <MoreVertIcon></MoreVertIcon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
export function Playlist() {
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const classes = useStyles();
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const xs = useMediaQuery(theme.breakpoints.up("sm"));
  const size = lg || (sm && xs);
  const {
    states: [menuState],
    open,
    close,
  } = useMenu();
  // console.log("playlist", playlist.list);
  return (
    <div className={classes.root}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            itemSize={48}
            itemCount={playlist.list.length}
            height={height}
            width={width}
            outerElementType={List}
            itemData={{
              size,
              onMenuClick: (
                target: EventTarget & HTMLButtonElement,
                index: number
              ) => {
                open(target, index);
              },
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
      <Menu
        anchorEl={menuState.anchor}
        keepMounted
        open={!!menuState.anchor}
        onClose={() => {
          close();
        }}
      >
        {!size ? (
          <MenuItem
            onClick={(e) => {
              if (menuState.index !== null) {
                close();
                setPlaylist((old) =>
                  PlaylistHelper.remove(old, menuState.index)
                );
              }
            }}
          >
            <ListItemIcon>
              <ClearIcon />
            </ListItemIcon>
            <Typography>移出歌单</Typography>
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={(e) => {
            //TODO
          }}
        >
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <Typography>下载</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
