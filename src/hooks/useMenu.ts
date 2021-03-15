import { useReducer } from "react";

export enum menuActionTypes {
  open,
  close,
}
type menuActions =
  | {
      type: menuActionTypes.open;
      anchor: EventTarget & HTMLButtonElement;
      index: number;
    }
  | { type: menuActionTypes.close };
export function useMenu() {
  const states = useReducer(
    (_: unknown, action: menuActions) => {
      switch (action.type) {
        case menuActionTypes.close:
          return {
            anchor: null,
            index: null,
          };
        case menuActionTypes.open:
          console.log("open");
          return {
            anchor: action.anchor,
            index: action.index,
          };
      }
    },
    {
      anchor: null,
      index: null,
    }
  );
  return {
    states,
    close: () => {
      states[1]({ type: menuActionTypes.close });
    },
    open: (anchor: EventTarget & HTMLButtonElement, index: number) => {
      states[1]({
        type: menuActionTypes.open,
        anchor,
        index,
      });
    },
  };
}
