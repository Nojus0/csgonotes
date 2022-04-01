import { createSignal } from "solid-js";

export const [userInteracted, setInteracted] = createSignal(false);

function handleInteraction() {
  if (!userInteracted()) {
    setInteracted(true);
  } else {
    removeEventListener("mousedown", handleInteraction);
  }
}

addEventListener("mousedown", handleInteraction);
