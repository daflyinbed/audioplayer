import { useRecoilState } from "recoil";
import { DownloadListOpen, DownloadListState } from "../atoms/downloadList";
// import AutoSizer from "react-virtualized-auto-sizer";
// import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React from "react";
import { buildSrc, downloadAll } from "../utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
// function Row(props: ListChildComponentProps) {
//   const [downloadListState, setDownloadListState] = useRecoilState(
//     DownloadListState
//   );
//   const { index } = props;
//   return (
//     <ListItem>
//       <ListItemText primaryTypographyProps={{ variant: "body2" }}>
//         {downloadListState[index]}
//       </ListItemText>
//     </ListItem>
//   );
// }
// function DownloadList() {
//   const downloadListState = useRecoilValue(DownloadListState);
//   return (
//     <AutoSizer>
//       {({ height, width }) => (
//         <FixedSizeList
//           itemSize={48}
//           itemCount={downloadListState.length}
//           height={height}
//           width={width}
//           outerElementType={List}
//           itemData={{}}
//         >
//           {Row}
//         </FixedSizeList>
//       )}
//     </AutoSizer>
//   );
// }

export function DownloadDialog() {
  const [list, setList] = useRecoilState(DownloadListState);
  const [open, setOpen] = useRecoilState(DownloadListOpen);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>
          你正在尝试下载{list.length}个文件 在浏览器做这种事大概不是一个好主意
        </DialogTitle>
        <DialogContent>
          {list.map((v) => (
            <Typography>{buildSrc(v)}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <CopyToClipboard text={list.map((v) => buildSrc(v)).join("\r\n")}>
            <Button>复制所有链接</Button>
          </CopyToClipboard>
          <Button
            onClick={() => {
              downloadAll(list);
            }}
          >
            继续用浏览器下载
          </Button>
          <Button
            onClick={() => {
              setList([]);
              setOpen(false);
            }}
          >
            清空
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
