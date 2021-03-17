import { useRecoilState, useRecoilValue } from "recoil";
import { DownloadListState } from "../atoms/downloadList";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ClearIcon from "@material-ui/icons/Clear";
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import React from "react";
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

export function DownloadDialog() {}
