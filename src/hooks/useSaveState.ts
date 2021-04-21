import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { MuteState, VolState } from "../atoms/audio";
interface Session {
  vol: number;
  isMute: boolean;
}
export function useSaveState() {
  const [volState, setVolState] = useRecoilState(VolState);
  const [muteState, setMuteState] = useRecoilState(MuteState);
  const ref = useRef<Session>({ vol: 100, isMute: false });
  const isFirstRef = useRef(true);
  useEffect(() => {
    ref.current.vol = volState;
  }, [volState]);
  useEffect(() => {
    ref.current.isMute = muteState;
  }, [muteState]);
  const cbRef = useRef<() => void>(() => {
    window.localStorage.setItem("vol", ref.current.vol.toString());
    window.localStorage.setItem("isMute", ref.current.isMute ? "1" : "0");
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
  }, [setMuteState, setVolState]);
  useEffect(() => {
    window.addEventListener("beforeunload", cbRef.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      window.removeEventListener("beforeunload", cbRef.current);
    };
  }, []);
}
