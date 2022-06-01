import { play } from ".";

export const buttonSounds = {
  onClick: () => play("/sound/generic_press_01.wav"),
  onMouseEnter: () => play("/sound/itemtile_rollover_09.wav"),
};
