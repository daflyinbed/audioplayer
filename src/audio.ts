import { Howl, Howler } from "howler";

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
}
