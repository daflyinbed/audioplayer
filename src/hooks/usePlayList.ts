import { useRef, useEffect } from "react";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
} from "recoil";
import { EndState, SrcState } from "../atoms/audio";
import { Order, PlayOrderState } from "../atoms/order";
import { PlaylistHelper, PlaylistState } from "../atoms/playlist";
import { random } from "../utils";

export function usePlayList() {
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const prevSrcRef = useRef<null | string>(null);
  const setSrcState = useSetRecoilState(SrcState);
  const [endState, setEndState] = useRecoilState(EndState);
  const playOrderState = useRecoilValue(PlayOrderState);
  useEffect(() => {
    if (
      playlist.list[playlist.cur] === null ||
      playlist.list[playlist.cur] === undefined
    ) {
      prevSrcRef.current = null;
      return;
    }
    if (prevSrcRef.current === playlist.list[playlist.cur].src) {
      return;
    }
    prevSrcRef.current = playlist.list[playlist.cur].src;
    setSrcState(playlist.list[playlist.cur].src);
  }, [playlist.cur, playlist.list, setSrcState]);
  useEffect(() => {
    if (!endState) {
      return;
    }
    setEndState(false);
    switch (playOrderState) {
      case Order.all:
        if (playlist.list.length === 1) {
          return;
        }
        setPlaylist((old) =>
          PlaylistHelper.jump(
            old,
            old.cur + 1 < old.list.length ? old.cur + 1 : 0
          )
        );
        break;
      case Order.random:
        setPlaylist((old) => PlaylistHelper.jump(old, random(old.list.length)));
        break;
    }
  }, [
    endState,
    playOrderState,
    playlist.list.length,
    setEndState,
    setPlaylist,
  ]);
}
