import { useRecoilState } from "recoil";
import { DownloadListOpen, DownloadListState } from "../atoms/downloadList";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { buildSrc, downloadAll } from "../utils";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
