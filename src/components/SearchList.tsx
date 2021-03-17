import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import PlayNextIcon from "@material-ui/icons/SlowMotionVideo";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import React, { useEffect, useState } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import { useMenu } from "../hooks/useMenu";
import { useRecoilState, useSetRecoilState } from "recoil";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
// import { DownloadListHelper, DownloadListState } from "../atoms/downloadList";
import { download, downloadAll } from "../utils";
import { BatchSearchSet } from "../atoms/batchlist";
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
    },
  })
);
function Row(props: ListChildComponentProps) {
  const { index, style, data } = props;
  const { list, size, onMenuClick } = data;
  const batch: boolean = data.batch;
  const setPlaylist = useSetRecoilState(PlaylistState);
  const [batchSet, setBatchSet] = useRecoilState(BatchSearchSet);
  return (
    <ListItem
      ContainerProps={{ style: style }}
      key={index}
      selected={batch && batchSet.has(index)}
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
          setPlaylist((old) =>
            PlaylistHelper.insertAndJump(old, list[index], old.cur + 1)
          );
        }
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

export function SearchList(props: { list: string[]; len: number }) {
  const classes = useStyles();
  const { list, len } = props;
  const setPlaylist = useSetRecoilState(PlaylistState);
  const [batch, setBatch] = useState(false);
  const [batchSet, setBatchSet] = useRecoilState(BatchSearchSet);
  const setDownloadList = useSetRecoilState(DownloadListState);
  const setDownloadListOpen = useSetRecoilState(DownloadListOpen);
  // const setDownloadListState = useSetRecoilState(DownloadListState);
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
  useEffect(() => {
    if (!batch) {
      setBatchSet(new Set());
    }
  }, [batch, setBatchSet]);
  return (
    <div className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <FormControlLabel
          control={
            <Checkbox
              onClick={() => {
                setBatch(!batch);
              }}
              checked={batch}
            ></Checkbox>
          }
          label={
            <Typography variant={size ? "body1" : "body2"}>批量</Typography>
          }
        ></FormControlLabel>
        {batch ? (
          <>
            <ButtonGroup
              size={size ? "small" : "medium"}
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              <Button
                onClick={() => {
                  let set = new Set<number>();
                  list.forEach((v, i) => {
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
            <ButtonGroup
              size={size ? "small" : "medium"}
              variant="text"
              color="primary"
            >
              <Button
                onClick={() => {
                  if (batchSet.size > 5) {
                    setDownloadListOpen(true);
                    setDownloadList((old) => {
                      let arr = [
                        ...old,
                        ...Array.from(batchSet).map((v) => list[v]),
                      ];
                      return Array.from(new Set(arr));
                    });
                  } else {
                    downloadAll(Array.from(batchSet).map((v) => list[v]));
                  }
                }}
              >
                下载
              </Button>
              <Button
                onClick={() => {
                  batchSet.forEach((v) => {
                    setPlaylist((old) => PlaylistHelper.insert(old, list[v]));
                  });
                }}
              >
                加入歌单
              </Button>
            </ButtonGroup>
          </>
        ) : null}
        <Typography
          variant={size ? "body1" : "body2"}
        >{`${list.length}/${len}`}</Typography>
      </Toolbar>
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
              batch,
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
            download(list[menuState.index]);
            // setDownloadListState((old) =>
            //   DownloadListHelper.add(old, {
            //     name: list[menuState.index],
            //     src: buildSrc(list[menuState.index]),
            //   })
            // );
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
