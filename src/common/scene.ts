import { createSignal } from "solid-js";

export interface IScene {
  name: string;
  audio: string;
  video: string;
}

export const Scenes: IScene[] = [
  {
    name: "Nuke",
    audio: "/static/sound/bg_nuke_01.ogg",
    video: "/static/video/nuke540.webm",
  },
  {
    name: "Vertigo",
    audio: "/static/sound/bg_vertigo_01.ogg",
    video: "/static/video/vertigo540.webm",
  },
  {
    name: "Anubis",
    audio: "/static/sound/bg_anubis_01.ogg",
    video: "/static/video/anubis540.webm",
  },
  {
    name: "Cobblestone",
    audio: "/static/sound/bg_cobble_night_01.ogg",
    video: "/static/video/cbble540.webm",
  },
  {
    name: "Mutiny",
    audio: "/static/sound/bg_mutiny_01.ogg",
    video: "/static/video/mutiny540.webm",
  },
  {
    name: "Blacksite",
    audio: "/static/sound/bg_blacksite_01.ogg",
    video: "/static/video/blacksite540.webm",
  },
  {
    name: "Swamp",
    audio: "/static/sound/bg_swamp_01.ogg",
    video: "/static/video/swamp540.webm",
  },
  {
    name: "Ancient",
    video: "/static/video/ancient540.webm",
    audio: "/static/sound/bg_inferno_01.ogg",
  },
  {
    name: "Sirocco",
    video: "/static/video/sirocco_night540.webm",
    audio: "/static/sound/bg_chlorine_01.ogg",
  },
  {
    name: "Apollo",
    video: "/static/video/apollo540.webm",
    audio: "/static/sound/bg_dust2_01.ogg",
  },
];

export function getRandomScene(): IScene {
  const randomIndex = Math.floor(Math.random() * Scenes.length);
  return Scenes[randomIndex];
}

export const [activeScene, setScene] = createSignal(getRandomScene());
