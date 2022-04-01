import { userInteracted } from "./ChromeAudio";

export function PlaySync(src: string, vol: number = 1.0) {
  if (!userInteracted()) return;

  const audio = new Audio(src);

  audio.src = src;
  audio.volume = vol;
  audio.play();
}
