import {
  Button,
  ButtonGroup,
  Checkbox,
  createStyles,
  FormControlLabel,
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
  Toolbar,
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
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import { useRecoilState, useSetRecoilState } from "recoil";
// import { DownloadListHelper, DownloadListState } from "../atoms/downloadList";
import { download, downloadAll } from "../utils";
// import { AudioState, PlayerState } from "../atoms/audio";
// import { HowlContainer } from "../audio";
import { BatchPlaySet } from "../atoms/batchlist";
import { DownloadListState, DownloadListOpen } from "../atoms/downloadList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: "100%",
      height: "100%",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: theme.palette.background.default,
    },
  })
);
function Row(props: ListChildComponentProps) {
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  // const setAudioState = useSetRecoilState(AudioState);
  const { index, style, data } = props;
  const batch: boolean = data.batch;
  const [batchSet, setBatchSet] = useRecoilState(BatchPlaySet);
  const size: boolean = data.size;
  const onMenuClick = data.onMenuClick;
  return (
    <ListItem
      ContainerProps={{ style: style }}
      button
      key={index}
      selected={batch ? batch && batchSet.has(index) : playlist.cur === index}
      onClick={() => {
        if (batch) {
          setBatchSet((old) => {
            let set = new Set(old);
            if (set.has(index)) {
              set.delete(index);
            } else {
              set.add(index);
            }
            return set;
          });
        } else {
          setPlaylist((old) => PlaylistHelper.jump(old, index));
        }
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
              if (index === playlist.cur) {
                // HowlContainer.unload();
                // setAudioState(PlayerState.Idle);
              }
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
export function Playlist(props: { isDialog?: boolean; onClose?: () => void }) {
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const classes = useStyles();
  const theme = useTheme();
  const [batch, setBatch] = useState(false);
  const [batchSet, setBatchSet] = useRecoilState(BatchPlaySet);
  const setDownloadList = useSetRecoilState(DownloadListState);
  const setDownloadListOpen = useSetRecoilState(DownloadListOpen);
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const xs = useMediaQuery(theme.breakpoints.up("sm"));
  const size = lg || (sm && xs);
  const {
    states: [menuState],
    open,
    close,
  } = useMenu();
  const Tool = () => (
    <Toolbar className={classes.toolbar}>
      {props.isDialog ? (
        <IconButton edge="start" onClick={props.onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      ) : null}
      <FormControlLabel
        control={
          <Checkbox
            onClick={() => {
              setBatch(!batch);
            }}
            checked={batch}
          ></Checkbox>
        }
        label={<Typography variant={size ? "body1" : "body2"}>批量</Typography>}
      ></FormControlLabel>
      {batch ? (
        <>
          <ButtonGroup
            size={size ? "small" : "medium"}
            variant="text"
            aria-label="text primary button group"
          >
            <Button
              onClick={() => {
                let set = new Set<number>();
                playlist.list.forEach((v, i) => {
                  set.add(i);
                });
                setBatchSet(set);
              }}
            >
              全选
            </Button>
            <Button
              onClick={() => {
                setBatchSet(new Set());
              }}
            >
              清除
            </Button>
          </ButtonGroup>
          <ButtonGroup size={size ? "small" : "medium"} variant="text">
            <Button
              onClick={() => {
                if (batchSet.size > 5) {
                  setDownloadListOpen(true);
                  setDownloadList((old) =>
                    Array.from(
                      new Set([
                        ...old,
                        ...Array.from(batchSet).map(
                          (v) => playlist.list[v].name
                        ),
                      ])
                    )
                  );
                } else {
                  downloadAll(
                    Array.from(batchSet).map((v) => playlist.list[v].name)
                  );
                }
              }}
            >
              下载
            </Button>
            <Button
              onClick={() => {
                setPlaylist((old) => PlaylistHelper.removeAll(old, batchSet));
                setBatchSet(new Set());
              }}
            >
              移出歌单
            </Button>
          </ButtonGroup>
        </>
      ) : null}
      {!batch && playlist.cur !== -1 ? (
        <Typography variant={size ? "body1" : "body2"}>{`当前${
          playlist.cur + 1
        }/${playlist.list.length}`}</Typography>
      ) : null}
    </Toolbar>
  );
  return (
    <div className={classes.root}>
      <Tool />
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            itemSize={48}
            itemCount={playlist.list.length}
            height={height - 64}
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
              batch,
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
            close();
            if (
              menuState.index == null ||
              playlist.list[menuState.index] == null
            ) {
              return;
            }
            download(playlist.list[menuState.index].name);
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
