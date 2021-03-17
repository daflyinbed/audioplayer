import { useRecoilState, useRecoilValue } from "recoil";
import { DownloadListOpen, DownloadListState } from "../atoms/downloadList";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ClearIcon from "@material-ui/icons/Clear";
import ClipboardJS from "clipboard";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { buildSrc, downloadAll } from "../utils";
function Row(props: ListChildComponentProps) {
  const [downloadListState, setDownloadListState] = useRecoilState(
    DownloadListState
  );
  const { index } = props;
  return (
    <ListItem>
      <ListItemText primaryTypographyProps={{ variant: "body2" }}>
        {downloadListState[index]}
      </ListItemText>
    </ListItem>
  );
}
function DownloadList() {
  const downloadListState = useRecoilValue(DownloadListState);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          itemSize={48}
          itemCount={downloadListState.length}
          height={height}
          width={width}
          outerElementType={List}
          itemData={{}}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
export {};

export function DownloadDialog() {
  const [list, setList] = useRecoilState(DownloadListState);
  const [open, setOpen] = useRecoilState(DownloadListOpen);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        你正在尝试下载{list.length}个文件 用别的软件下载可能是更好的办法
      </DialogTitle>
      <DialogContent>
        {list.map((v) => (
          <Typography>{buildSrc(v)}</Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          ref={btnRef}
          onClick={() => {
            let clip = new ClipboardJS(btnRef.current!!, {
              text: (_) => {
                let str = list.map((v) => `${buildSrc(v)}`).join("\n");
                console.log(str);
                return str;
              },
            });
            btnRef.current?.click();
            clip.destroy();
          }}
        >
          复制所有链接
        </Button>
        <Button
          onClick={() => {
            downloadAll(list);
          }}
        >
          下载
        </Button>
        <Button>清空</Button>
      </DialogActions>
    </Dialog>
  );
}
