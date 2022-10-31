import { buttonSounds } from "@Common/Audio/AudioSource";
import { Scenes, setScene } from "@Common/Scene";
import { Component, onMount } from "solid-js";
import { useStateContext } from "@Common/Context/StateContext";

const ShortcutManager: Component = () => {
  let i = 0;
  const ctx = useStateContext();

  onMount(() => {
    addEventListener("keyup", onShortcutKey);
  });

  function onShortcutKey(e: KeyboardEvent) {
    if (
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLInputElement
    ) {
      return;
    }
    switch (e.key) {
      case "n":
        i = (i + 1) % Scenes.length;
        setScene(Scenes[i]);
        buttonSounds.onClick();
        break;

      case "b":
        i = i < 1 ? Scenes.length - 1 : (i - 1) % Scenes.length;
        setScene(Scenes[i]);
        buttonSounds.onClick();
        break;

      case e.ctrlKey && ctx.keypair.loaded && ctx.notes.loaded && "c":
        ctx.setCopyClipboard(true);
        break;

      case "m":
        ctx.toggleMute();
        buttonSounds.onClick();
        break;
    }
  }

  return null;
};

export default ShortcutManager;
