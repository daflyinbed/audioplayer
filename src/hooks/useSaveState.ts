import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CurTimeState, MuteState, SeekState, VolState } from "../atoms/audio";
import { PlaylistState, playlistState } from "../atoms/playlist";
interface Session {
  vol: number;
  isMute: boolean;
  playlist: playlistState;
  curTime: number;
}
export function useSaveState() {
  const [volState, setVolState] = useRecoilState(VolState);
  const [muteState, setMuteState] = useRecoilState(MuteState);
  const [playlist, setPlaylist] = useRecoilState(PlaylistState);
  const curTime = useRecoilValue(CurTimeState);
  const setCurTime = useSetRecoilState(SeekState);
  const ref = useRef<Session>({
    vol: 100,
    isMute: false,
    playlist: {
      list: [],
      cur: -1,
    },
    curTime: 0,
  });
  const isFirstRef = useRef(true);
  useEffect(() => {
    ref.current.vol = volState;
  }, [volState]);
  useEffect(() => {
    ref.current.isMute = muteState;
  }, [muteState]);
  useEffect(() => {
    ref.current.playlist = playlist;
  }, [playlist]);
  useEffect(() => {
    ref.current.curTime = curTime;
  }, [curTime]);
  const cbRef = useRef<() => void>(() => {
    window.localStorage.setItem("vol", ref.current.vol.toString());
    window.localStorage.setItem("isMute", ref.current.isMute ? "1" : "0");
    window.localStorage.setItem(
      "playlist",
      JSON.stringify(ref.current.playlist)
    );
    window.localStorage.setItem("curTime", ref.current.curTime.toString());
  });
  useEffect(() => {
    if (!isFirstRef.current) {
      return;
    }
    isFirstRef.current = false;
    let vol_str = window.localStorage.getItem("vol");
    if (vol_str) {
      let vol = parseInt(vol_str);
      if (vol >= 0 && vol <= 100) {
        setVolState(vol);
      }
    }
    let mute_str = window.localStorage.getItem("isMute");
    if (mute_str) {
      if (parseInt(mute_str) === 1) {
        setMuteState(true);
      } else {
        setMuteState(false);
      }
    }
    let playlist_str = window.localStorage.getItem("playlist");
    if (playlist_str) {
      try {
        let tmp = JSON.parse(playlist_str);
        setPlaylist(tmp);
      } catch (err) {}
    }
    let ct_str = window.localStorage.getItem("curTime");
    if (ct_str) {
      let ct = parseFloat(ct_str);
      if (ct >= 0) {
        setCurTime(ct);
      }
    }
  }, [setCurTime, setMuteState, setPlaylist, setVolState]);
  useEffect(() => {
    window.addEventListener("beforeunload", cbRef.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      window.removeEventListener("beforeunload", cbRef.current);
    };
  }, []);
}
