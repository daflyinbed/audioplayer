// import { useSetRecoilState } from "recoil";
// import { AudioState, PlayerState } from "../atoms/audio";
import { HowlContainer } from "../audio";
// export function useHowl(src: string) {
//   const setAudioState = useSetRecoilState(AudioState);
//   if (!HowlContainer.get()) {
//     HowlContainer.load(src);
//     setAudioState(PlayerState.Loading);
//     HowlContainer.get()?.once("load", () => {
//       let howl = HowlContainer.get();
//       howl?.play();
//       setAudioState(PlayerState.Playing);
//     });
//   }
//   HowlContainer.get()?.load();
// }
