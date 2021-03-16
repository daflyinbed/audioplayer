import { useRecoilState } from "recoil";
import { DownloadListState, downloadState } from "../atoms/downloadList";
import { Downloader } from "../download";

export function useDownload() {
  const [dls, setDls] = useRecoilState(DownloadListState);
  let instance = Downloader.get();
  instance.setOne((index, name) => {
    setDls((old) => {
      let arr = [...old.list];
      arr[index].state = downloadState.downloaded;
      return {
        cur: old.cur,
        list: arr,
      };
    });
  });
}
