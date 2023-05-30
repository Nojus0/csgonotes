import { play } from "@Common/Audio/Preload"
import { StaticAudioSource } from "@Common/Audio/AudioSources"

const AudioSource = StaticAudioSource

export const PrimitiveAudioList = Object.values(AudioSource.Button)

export const buttonSounds = {
  onClick: () => play(AudioSource.Button.Click),
  onMouseEnter: () => play(AudioSource.Button.MouseOver),
}

export function playErrorSound() {
  play(AudioSource.Button.Quit)
}

export default AudioSource
