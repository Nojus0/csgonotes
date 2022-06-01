import { createSignal } from "solid-js";

export interface IScene {
  name: string;
  audio: string;
  video: string;
}

export const Scenes: IScene[] = [
  {
    name: "Nuke",
    audio: "/sound/bg_nuke_01.ogg",
    video: "/video/nuke540.webm",
  },
  {
    name: "Vertigo",
    audio: "/sound/bg_vertigo_01.ogg",
    video: "/video/vertigo540.webm",
  },
  {
    name: "Anubis",
    audio: "/sound/bg_anubis_01.ogg",
    video: "/video/anubis540.webm",
  },
  {
    name: "Cobblestone",
    audio: "/sound/bg_cobble_night_01.ogg",
    video: "/video/cbble540.webm",
  },
  {
    name: "Mutiny",
    audio: "/sound/bg_mutiny_01.ogg",
    video: "/video/mutiny540.webm",
  },
  {
    name: "Blacksite",
    audio: "/sound/bg_blacksite_01.ogg",
    video: "/video/blacksite540.webm",
  },
  {
    name: "Swamp",
    audio: "/sound/bg_swamp_01.ogg",
    video: "/video/swamp540.webm",
  },
  {
    name: "Ancient",
    video: "/video/ancient540.webm",
    audio: "/sound/bg_inferno_01.ogg",
  },
  {
    name: "Sirocco",
    video: "/video/sirocco_night540.webm",
    audio: "/sound/bg_chlorine_01.ogg",
  },
  {
    name: "Apollo",
    video: "/video/apollo540.webm",
    audio: "/sound/bg_dust2_01.ogg",
  },
];

export function getRandomScene(): IScene {
  const randomIndex = Math.floor(Math.random() * Scenes.length);
  return Scenes[randomIndex];
}

export const [activeScene, setScene] = createSignal(getRandomScene());
