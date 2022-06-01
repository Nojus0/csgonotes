import { get } from "idb-keyval";
import { batch, Component, onMount } from "solid-js";
import { buttonSounds } from "../common/audio/button";
import Backdrop, { Description } from "./Backdrop";
import { useStateContext } from "./Context/StateContext";
import { InspectUri } from "./CopyBackdrop";
import { TextButton } from "./Primitive/Button";

const RestoreBackdrop: Component = (p) => {
  const ctx = useStateContext();

  onMount(async () => {
    const [keypair_handle, list_handle]: FileSystemFileHandle[] =
      await Promise.all([get("keypair"), get("list")]);

    const { IsSerializedLink } = InspectUri();
    if (keypair_handle && list_handle && !IsSerializedLink) {
      ctx.setRestore(true);
    }
  });

  const RestoreCancel = () =>
    batch(() => {
      ctx.setRestore(false);
      ctx.resetCredentials();
    });

  return (
    <Backdrop
      title="Restore"
      description={
        <>
          <Description>Restore your previous session?</Description>
        </>
      }
      onBackgroundClick={RestoreCancel}
      when={ctx.showRestore}
    >
      <TextButton
        onClick={() => {
          RestoreCancel();
          buttonSounds.onClick();
        }}
      >
        No
      </TextButton>
      <TextButton onClick={ctx.restoreSession}>Yes</TextButton>
    </Backdrop>
  );
};

export default RestoreBackdrop;
