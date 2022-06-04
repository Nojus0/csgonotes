import { play } from "./preload";
import SoundSource from "./SoundSource";

export const buttonSounds = {
  onClick: () => play(SoundSource.Button.Click),
  onMouseEnter: () => play(SoundSource.Button.MouseOver),
};
