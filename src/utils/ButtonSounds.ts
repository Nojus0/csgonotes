import { PlaySync } from "./Audio";

export const ButtonSounds = {
  onClick: () => PlaySync("/sound/generic_press_01.wav"),
  onMouseEnter: () => PlaySync("/sound/itemtile_rollover_09.wav"),
};
