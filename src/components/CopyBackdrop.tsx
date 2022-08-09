import base58 from "bs58";
import {
  batch,
  Component,
  createEffect,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import {
  AES_KEY_BITS,
  DetailedKeypair,
  serializeKeyPair,
  VERSION,
} from "../common/KeyPair";
import Backdrop, { Description } from "./Backdrop";
import { useStateContext } from "@common/Context/StateContext";
import { TextButton } from "./Primitive/Button";
import { buttonSounds } from "@common/audio/AudioSource";
import { decryptList, encryptList } from "@common/ListFile";

export function InspectUri() {
  const url = new URL(location.href);
  const params = url.searchParams;

  const key = params.get("key");
  const iv = params.get("iv");
  const list = params.get("list");

  return {
    key,
    iv,
    list,
    IsSerializedLink: key && iv && list,
  };
}

const CopyBackdrop: Component = (p) => {
  const ctx = useStateContext();
  const [text, setText] = createSignal("5");
  let timer: NodeJS.Timer;

  createEffect(() => {
    if (!ctx.showCopyClipboard) {
      clearInterval(timer);
      setText("5");
      return;
    }

    timer = setInterval(() => {
      const num = parseInt(text());
      if (num > 0) {
        setText(`${num - 1}`);
        buttonSounds.onMouseEnter();
      } else {
        buttonSounds.onMouseEnter();
        setText("Copy");
        clearInterval(timer);
        return;
      }
    }, 1000);
  });

  onMount(async () => {
    const { iv, key, list, IsSerializedLink } = InspectUri();
    if (!IsSerializedLink) return;

    const keypair: DetailedKeypair = {
      key: await crypto.subtle.importKey(
        "raw",
        base58.decode(key),
        {
          name: "AES-GCM",
          hash: "SHA-512",
          length: AES_KEY_BITS,
        },
        true,
        ["encrypt", "decrypt"]
      ),
      iv: base58.decode(iv),
      version: VERSION,
    };

    const listStore = await decryptList(keypair, base58.decode(list));

    // * VERY IMPORTANT *
    batch(() => {
      ctx.setShowTopbar(true);
      ctx.setKeyPair({ ...keypair, handle: null, loaded: true });
      ctx.setList({ ...listStore, handle: null, loaded: true });
    });
  });

  async function copyListToClipboard() {
    const url = new URL(location.href);
    const p = url.searchParams;
    const s = await serializeKeyPair(ctx.keypair);
    p.set("key", s.key);
    p.set("iv", s.iv);
    p.set(
      "list",
      base58.encode(new Uint8Array(await encryptList(ctx.keypair, ctx.list)))
    );

    navigator.clipboard.writeText(url.href);
  }

  return (
    <Backdrop
      title="Copy to Clipboard"
      description={
        <>
          <Description>
            Serialize the list and the keypair into a shareable link.
          </Description>
          <Description>
            NOTE: Anyone with the link can access the list.
          </Description>
        </>
      }
      onBackgroundClick={() => ctx.setCopyClipboard(false)}
      when={ctx.showCopyClipboard}
    >
      <TextButton
        onClick={() => {
          buttonSounds.onClick();
          ctx.setCopyClipboard(false);
        }}
      >
        Close
      </TextButton>
      <TextButton
        onClick={() => {
          if (ctx.showCopyClipboard && text() == "Copy") {
            copyListToClipboard();
            buttonSounds.onClick();
          }
        }}
      >
        {text()}
      </TextButton>
    </Backdrop>
  );
};

export default CopyBackdrop;
