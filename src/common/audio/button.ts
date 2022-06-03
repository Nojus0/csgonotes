import { play } from "./preload";

export const buttonSounds = {
  onClick: () => play("/static/sound/generic_press_01.wav"),
  onMouseEnter: () => play("/static/sound/itemtile_rollover_09.wav"),
};
