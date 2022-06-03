import { userInteracted } from "./chromeInteraction";

const PrimitiveAudioList = [
  "/static/sound/generic_press_01.wav",
  "/static/sound/mainmenu_press_quit_02.wav",
  "/static/sound/itemtile_rollover_09.wav",
];

export async function preloadPrimitiveAudio() {
  for (const url of PrimitiveAudioList) {
    preloadAudio(url);
  }
}

export async function preloadAudio(src: string) {
  var audio = new Audio();
  audio.src = src;
}

export function play(src: string, vol: number = 1.0) {
  if (!userInteracted()) return;

  const audio = new Audio(src);

  audio.src = src;
  audio.volume = vol;
  audio.play();
}
