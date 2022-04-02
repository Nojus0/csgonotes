import { userInteracted } from "./ChromeAudio";

const audioLoadList = [
  "/sound/generic_press_01.wav",
  "/sound/mainmenu_press_quit_02.wav",
  "/sound/itemtile_rollover_09.wav",
];

export async function preloadPrimitiveAudio() {
  for (const url of audioLoadList) {
    preloadAudio(url);
  }
}

export function play(src: string, vol: number = 1.0) {
  if (!userInteracted()) return;

  const audio = new Audio(src);

  audio.src = src;
  audio.volume = vol;
  audio.play();
}

export async function preloadAudio(src: string) {
  var audio = new Audio();
  audio.src = src;

  function loaded() {
    audio.removeEventListener("canplaythrough", loaded);
  }

  audio.addEventListener("canplaythrough", loaded);
}
