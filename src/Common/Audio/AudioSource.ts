import { play } from "@Common/Audio/Preload"
import createAudioSource from "@Common/Audio/createAudioSource"

const S = import.meta.env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true"

const AudioSource = createAudioSource(S)

export const PrimitiveAudioList = Object.values(AudioSource.Button)

export const buttonSounds = {
  onClick: () => play(AudioSource.Button.Click),
  onMouseEnter: () => play(AudioSource.Button.MouseOver),
}

export function playErrorSound() {
  play(AudioSource.Button.Quit)
}

export default AudioSource
