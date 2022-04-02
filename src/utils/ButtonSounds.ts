import { play } from "./Audio";

export const ButtonSounds = {
  onClick: () => play("/sound/generic_press_01.wav"),
  onMouseEnter: () => play("/sound/itemtile_rollover_09.wav"),
};
