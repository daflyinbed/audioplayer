import { Howl } from "howler";

export class HowlContainer {
  private static howler: Howl | undefined;
  private constructor() {}
  public static load(src: string) {
    if (this.howler !== undefined) {
      this.howler.unload();
    }
    this.howler = new Howl({ src, preload: "metadata" });
  }
  public static get() {
    return this.howler;
  }
  public static unload() {
    HowlContainer.howler?.unload();
    HowlContainer.howler = undefined;
  }
}
