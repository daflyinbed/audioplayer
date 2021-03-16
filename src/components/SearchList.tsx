import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import PlayNextIcon from "@material-ui/icons/SlowMotionVideo";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import React from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import { useMenu } from "../hooks/useMenu";
import { useSetRecoilState } from "recoil";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
import { DownloadListHelper, DownloadListState } from "../atoms/downloadList";
import { buildSrc } from "../utils";

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
  const { index, style, data } = props;
  const { list, size, onMenuClick } = data;
  const setPlaylist = useSetRecoilState(PlaylistState);
  return (
    <ListItem
      ContainerProps={{ style: style }}
      button
      key={index}
      onClick={() => {
        setPlaylist((old) =>
          PlaylistHelper.insertAndJump(old, list[index], old.cur + 1)
        );
      }}
    >
      <ListItemText
        primaryTypographyProps={{ variant: size ? "body1" : "body2" }}
      >
        {list[index]}
      </ListItemText>
      <ListItemSecondaryAction>
        {size ? (
          <IconButton
            onClick={(e) => {
              setPlaylist((old) =>
                PlaylistHelper.insert(old, list[index], old.cur + 1)
              );
            }}
          >
            <PlayNextIcon></PlayNextIcon>
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

export function SearchList(props: { list: string[] }) {
  const classes = useStyles();
  const { list } = props;
  const setPlaylist = useSetRecoilState(PlaylistState);
  const setDownloadListState = useSetRecoilState(DownloadListState);
  const {
    states: [menuState],
    open,
    close,
  } = useMenu();
  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const xs = useMediaQuery(theme.breakpoints.up("sm"));
  const size = lg || (sm && xs);

  return (
    <div className={classes.root}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            itemSize={48}
            itemCount={list.length}
            height={height}
            width={width}
            outerElementType={List}
            itemData={{
              list: list,
              size: size,
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
                  PlaylistHelper.insert(old, list[menuState.index], old.cur + 1)
                );
              }
            }}
          >
            <ListItemIcon>
              <PlayNextIcon />
            </ListItemIcon>
            <Typography>下一首播放</Typography>
          </MenuItem>
        ) : null}

        <MenuItem
          onClick={(e) => {
            if (menuState.index !== null) {
              close();
              setPlaylist((old) =>
                PlaylistHelper.insert(old, list[menuState.index])
              );
            }
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <Typography>加入歌单</Typography>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            close();
            if (menuState.index == null || list[menuState.index] == null) {
              return;
            }
            setDownloadListState((old) =>
              DownloadListHelper.add(old, {
                name: list[menuState.index],
                src: buildSrc(list[menuState.index]),
              })
            );
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
