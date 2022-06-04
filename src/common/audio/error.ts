import { play } from "./preload";
import SoundSource from "./SoundSource";

export function playErrorSound() {
  play(SoundSource.Button.Quit);
}
