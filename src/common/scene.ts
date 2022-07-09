import { createSignal } from "solid-js";
import AudioSource from "./Audio/AudioSource";

export interface IScene {
  name: string;
  audio: string;
  video: string;
}

export const Scenes: IScene[] = [
  {
    name: "Nuke",
    video: "https://i.imgur.com/grvpAj3.mp4",
    audio: AudioSource.Ambience.Nuke,
  },
  {
    name: "Vertigo",
    video: "https://i.imgur.com/1nJ5fPG.mp4",
    audio: AudioSource.Ambience.Vertigo,
  },
  {
    name: "Anubis",
    video: "https://i.imgur.com/UhZZVDo.mp4",
    audio: AudioSource.Ambience.Anubis,
  },
  {
    name: "Cobblestone",
    video: "https://i.imgur.com/DsQUZXi.mp4",
    audio: AudioSource.Ambience.Cobblestone,
  },
  {
    name: "Mutiny",
    video: "https://i.imgur.com/o0sixra.mp4",
    audio: AudioSource.Ambience.Mutiny,
  },
  {
    name: "Blacksite",
    video: "https://i.imgur.com/uUNR3Dp.mp4",
    audio: AudioSource.Ambience.Blacksite,
  },
  {
    name: "Swamp",
    video: "https://i.imgur.com/24AtgQ6.mp4",
    audio: AudioSource.Ambience.Swamp,
  },
  {
    name: "Ancient",
    video: "https://i.imgur.com/NdxvAEF.mp4",
    audio: AudioSource.Ambience.Inferno,
  },
  {
    name: "Sirocco",
    video: "https://i.imgur.com/zRUrtY9.mp4",
    audio: AudioSource.Ambience.Chlorine,
  },
  {
    name: "Apollo",
    video: "https://i.imgur.com/fHKiKs4.mp4",
    audio: AudioSource.Ambience.Dust2,
  },
];

export function getRandomScene(): IScene {
  const randomIndex = Math.floor(Math.random() * Scenes.length);
  return Scenes[randomIndex];
}

export const [activeScene, setScene] = createSignal(getRandomScene());
