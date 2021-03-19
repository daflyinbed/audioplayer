import { useRef, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { AudioState, PlayerState } from "../atoms/audio";
import { PlaylistState } from "../atoms/playlist";
import { HowlContainer } from "../audio";

export function usePlayList() {
  const playlist = useRecoilValue(PlaylistState);
  const prevSrcRef = useRef<null | string>(null);
  const setAudioState = useSetRecoilState(AudioState);
  console.log("playlist", playlist);
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
    console.log("src changed");
    HowlContainer.load(playlist.list[playlist.cur].src);
    setAudioState(PlayerState.Loading);
    HowlContainer.get()?.once("load", () => {
      HowlContainer.get()?.play();
      setAudioState(PlayerState.Playing);
    });
    HowlContainer.get()?.load();
  }, [playlist.cur, playlist.list, setAudioState]);
}
