export function buildSrc(name: string): string {
  return `http://dl.xwbx.ink/5424/${name}.mp3`;
}
function divmod(num: number, div: number): [number, number] {
  return [Math.floor(num / div), Math.floor(num % div)];
}
function pad2(str: number): string {
  return str.toString().padStart(2, "0");
}
export function sec2str(len: number): string {
  if (len <= 0) {
    return "00:00";
  }
  let [m, s] = divmod(Math.floor(len), 60);
  return `${pad2(m)}:${pad2(s)}`;
}
export function random(max: number) {
  let result = Math.floor(Math.random() * max);
  console.log("random", result);
  return result;
}
export function download(name: string) {
  let ele = document.createElement("a");
  ele.setAttribute("href", buildSrc(name));
  ele.setAttribute("download", "download");
  ele.click();
  ele.remove();
}
export function downloadAll(names: string[]) {
  let index = 0;
  const interval = setInterval(() => {
    download(names[index]);
    index++;
    if (index >= names.length) {
      clearInterval(interval);
    }
  }, 1000);
}
