import {userInteracted} from "@Common/Audio/ChromeFix";
import {PrimitiveAudioList} from "@Common/Audio/AudioSource";

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
