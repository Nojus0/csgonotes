import {createSignal} from "solid-js";
import AudioSource from "./Audio/AudioSource";
import VideoSource from "@common/VideoSource";

export interface IScene {
    name: string;
    audio: string;
    video: string;
}

const S = import.meta.env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true"

export const Scenes: IScene[] = [
    {
        name: "Nuke",
        video: VideoSource.Nuke,
        audio: AudioSource.Ambience.Nuke,
    },
    {
        name: "Vertigo",
        video: VideoSource.Vertigo,
        audio: AudioSource.Ambience.Vertigo,
    },
    {
        name: "Anubis",
        video: VideoSource.Anubis,
        audio: AudioSource.Ambience.Anubis,
    },
    {
        name: "Cobblestone",
        video: VideoSource.Cobblestone,
        audio: AudioSource.Ambience.Cobblestone,
    },
    {
        name: "Mutiny",
        video: VideoSource.Mutiny,
        audio: AudioSource.Ambience.Mutiny,
    },
    {
        name: "Blacksite",
        video: VideoSource.Blacksite,
        audio: AudioSource.Ambience.Blacksite,
    },
    {
        name: "Swamp",
        video: VideoSource.Swamp,
        audio: AudioSource.Ambience.Swamp,
    },
    {
        name: "Ancient",
        video: VideoSource.Ancient,
        audio: AudioSource.Ambience.Inferno,
    },
    {
        name: "Sirocco",
        video: VideoSource.Sirocco,
        audio: AudioSource.Ambience.Chlorine,
    },
    {
        name: "Apollo",
        video: VideoSource.Apollo,
        audio: AudioSource.Ambience.Dust2,
    },
];

export function getRandomScene(): IScene {
    const randomIndex = Math.floor(Math.random() * Scenes.length);
    return Scenes[randomIndex];
}

export const [activeScene, setScene] = createSignal(getRandomScene());
