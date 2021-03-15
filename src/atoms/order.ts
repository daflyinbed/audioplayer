import { atom } from "recoil";

export enum Order {
  one,
  all,
  random,
}
const PlayOrderState = atom<Order>({
  key: "playOrder",
  default: Order.all,
});

export { PlayOrderState };
