/* @refresh reload */

import {
  Accessor,
  batch,
  Component,
  createEffect,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { styled } from "solid-styled-components";
import {
  createNewList,
  defaultListStore,
  getListName,
  List,
  ListFileStore,
  loadList,
} from "../common/crypto/listfile";
import { createStore } from "solid-js/store";
import {
  AES_KEY_BITS,
  createNewKeypair,
  decryptList,
  defaultKeyPairStore,
  encryptList,
  exportKeyPair,
  KeypairFile,
  KeyPairStore,
  loadKeyPair,
  serializeKeyPair,
  VERSION,
} from "../common/crypto/keypair";
import { endings, mime, writeFile } from "../common/filesystem";
import { encryptJsonObject } from "../common/crypto";
import { GreenButton, TextButton } from "../components/Primitive/Button";
import { Input, TextArea } from "../components/Primitive/Input";
import { userInteracted } from "../common/audio/chrome";
import { ButtonSounds } from "../common/audio/button";
import { getRandomScene, IScene, Scenes } from "../common/scene";
import { preloadPrimitiveAudio, preloadAudio } from "../common/audio";
import QuitIcon from "../components/Svg/QuitIcon";
import SaveIcon from "../components/Svg/SaveIcon";
import { playErrorSound } from "../common/audio/error";
import Backdrop, { Description } from "../components/Backdrop";
import base58 from "bs58";
import { clear, del, delMany, get, set } from "idb-keyval";
import { useStateContext } from "../components/Context/StateContext";
const Home: Component = () => {
  let i = 0;
  const ctx = useStateContext()

  createEffect(() => {
    console.log(`dsa`, ctx.showVideo);
  });
  
  onMount(async () => {
    preloadPrimitiveAudio();
    preloadAudio(ctx.scene.audio);
    addEventListener("keyup", onShortcutKey);
    ctx.setVideo(true);
    const url = new URL(location.href);
    const params = url.searchParams;

    const key = params.get("key");
    const iv = params.get("iv");
    const list = params.get("list");

    const [keypair_handle, list_handle]: FileSystemFileHandle[] =
      await Promise.all([get("keypair"), get("list")]);

    if (keypair_handle != null && list_handle != null) {
      console.log(`restore`)
      ctx.setRestore(true);
    }

    if (!key || !iv || !list) return;

    const keypair: KeypairFile = {
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

    const listfile = await decryptList(keypair, base58.decode(list));

    batch(() => {
      ctx.setKeyPair({ ...keypair, loaded: true });
      ctx.setList({ ...listfile, loaded: true });
    });
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
        ctx.setScene(Scenes[i]);
        ButtonSounds.onClick();
        break;

      case "b":
        i = i < 1 ? Scenes.length - 1 : (i - 1) % Scenes.length;
        ctx.setScene(Scenes[i]);
        ButtonSounds.onClick();
        break;

      case e.ctrlKey && ctx.keypair.loaded && ctx.list.loaded && "c":
        ctx.setCopyClipboard(true);
        break;

      case "m":
        ctx.toggleMute();
        ButtonSounds.onClick();
        break;
    }
  }
  async function NewKeypair() {
    ButtonSounds.onClick();

    const NEW_PAIR = await createNewKeypair();
    await exportKeyPair(NEW_PAIR);
    ctx.setKeyPair({ ...NEW_PAIR, loaded: true });
  }
  async function NewList() {
    const NEW_LIST = createNewList();
    const enc = await encryptJsonObject(ctx.keypair, NEW_LIST);

    await writeFile(enc, mime.bin, endings.bin, getListName(), "list");
    ctx.setList({ ...NEW_LIST, loaded: true });
  }
  async function LoadKeypair() {
    ctx.setKeyPair({ ...(await loadKeyPair()), loaded: true });
  }
  async function LoadList() {
    const list = await loadList(ctx.keypair);
    if (list == null) return playErrorSound();

    ctx.setList({ ...list, loaded: true });
  }

  async function Save() {
    const CIPHER = await encryptList(ctx.keypair, ctx.list);
    const hn: FileSystemFileHandle = await get("list");

    if (!hn) {
      // TODO SET NAME TO LOADED ONE
      const newHandle = await writeFile(
        CIPHER,
        mime.bin,
        endings.bin,
        getListName(),
        "list"
      );
      return;
    }

    try {
      const writable = await hn.createWritable();
      await writable.write(CIPHER);
      await writable.close();
    } catch (err) {
      playErrorSound();
    }
  }
  function onSourceChange(e: HTMLVideoElement | HTMLAudioElement) {
    // createEffect(() => {
    e.load();
    // });
  }
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
  const [text, setText] = createSignal("5");
  const [showTimer, setShowTimer] = createSignal(false);
  let timer: NodeJS.Timer;
  createEffect(() => {
    if (showTimer()) {
      timer = setInterval(() => {
        const t = text();
        const tt = parseInt(t);

        if (tt > 0) {
          setText(`${tt - 1}`);
          ButtonSounds.onMouseEnter();
        } else {
          ButtonSounds.onMouseEnter();
          setText("Copy");
          clearInterval(timer);
          return;
        }
      }, 1000);
    } else {
      clearInterval(timer);
      setText("5");
    }
  });

  return (
    <Container>
      <Backdrop
        title="Copy to Clipboard"
        description={
          <>
            <Description>
              Serialize the list and the ctx.keypair into a shareable link.
            </Description>
            <Description>
              NOTE: Anyone with the link can access the list.
            </Description>
          </>
        }
        setWhen={ctx.setCopyClipboard}
        when={ctx.showCopyClipboard}
      >
        <TextButton
          onClick={() => {
            ctx.setCopyClipboard(false);
            ButtonSounds.onClick();
          }}
        >
          Close
        </TextButton>
        <TextButton
          onClick={() => {
            if (ctx.showCopyClipboard && text() == "Copy") {
              copyListToClipboard();
              ButtonSounds.onClick();
            }
          }}
        >
          {text()}
        </TextButton>
      </Backdrop>
      <Backdrop
        title="Restore"
        description={
          <>
            <Description>Restore your previous session?</Description>
          </>
        }
        setWhen={ctx.setRestore}
        when={ctx.showRestore}
      >
        <TextButton
          onClick={() => {
            ctx.setRestore(false);
            ctx.resetCredentials();
            ButtonSounds.onClick();
          }}
        >
          No
        </TextButton>
        <TextButton
          onClick={async () => {
            ButtonSounds.onClick();
            await LoadKeypair();
            await LoadList();
            ctx.setRestore(false);
          }}
        >
          Yes
        </TextButton>
      </Backdrop>

      <Show when={ctx.showVideo}>
        <Video
          preload="auto"
          ref={onSourceChange}
          loop
          autoplay
          muted
          draggable={false}
        >
          <source type="video/webm" src={ctx.scene.video} />
        </Video>
      </Show>

      <Show when={userInteracted() && !ctx.muted}>
        <audio ref={onSourceChange} loop autoplay>
          <source type="audio/ogg" src={ctx.scene.audio} />
        </audio>
      </Show>

      <TopBar>
        {!ctx.keypair.loaded && !ctx.list.loaded && (
          <GreenButton onClick={() => LoadKeypair() && ButtonSounds.onClick()}>
            Load Keypair
          </GreenButton>
        )}

        {ctx.keypair.loaded && !ctx.list.loaded && (
          <>
            <GreenButton onClick={() => LoadList() && ButtonSounds.onClick()}>
              Load List
            </GreenButton>
            <GreenButton onClick={() => NewList() && ButtonSounds.onClick()}>
              New List
            </GreenButton>
          </>
        )}

        {ctx.list.loaded && (
          <>
            <AdaptiveGreenButton
              onClick={() => {
                ctx.newIdea();
                ButtonSounds.onClick();
              }}
            >
              Add
            </AdaptiveGreenButton>
            <AdaptiveGreenButton
              onClick={() => Save() && ButtonSounds.onClick()}
            >
              <SaveMargined height="1.2rem" />
              Save
            </AdaptiveGreenButton>
          </>
        )}

        {!ctx.keypair.loaded && (
          <GreenButton onClick={() => NewKeypair() && ButtonSounds.onClick()}>
            New Keypair
          </GreenButton>
        )}

        <Show when={ctx.keypair.loaded && ctx.list.loaded}>
          <TopBarRightWrapper>
            <InputResponsiveWrapper>
              <Input
                width="100%"
                margin="0"
                value={ctx.list.name}
                placeholder="List name"
                onInput={(e) => ctx.setListName(e.currentTarget.value)}
              />
            </InputResponsiveWrapper>
            <Icons>
              <Quit
                {...ButtonSounds}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  ctx.resetCredentials();
                  ButtonSounds.onClick();
                }}
              />
            </Icons>
          </TopBarRightWrapper>
        </Show>
      </TopBar>
      <Browser>
        <Show when={ctx.list.loaded}>
          <For each={ctx.list.ideas}>
            {(todo, i) => (
              <CardWrapper>
                <Card>
                  <TextArea
                    cols={30}
                    rows={10}
                    value={todo}
                    onChange={(e) => ctx.updateIdeaText(i(), e.currentTarget.value)}
                  />
                  <DeleteButton
                    padding=".5rem 1rem"
                    onClick={() => {
                      ctx.deleteIdea(i());
                      ButtonSounds.onClick();
                    }}
                  >
                    Delete
                  </DeleteButton>
                </Card>
              </CardWrapper>
            )}
          </For>
        </Show>
      </Browser>
    </Container>
  );
};

const AdaptiveGreenButton = styled(GreenButton)({
  padding: ".65rem 1.75rem",
  "@media (max-width: 30rem)": {
    padding: ".65rem 1rem",
  },
});

const Icons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
});

const SaveMargined = styled(SaveIcon)({
  margin: "0 .2rem 0 0",
});

const Quit = styled(QuitIcon)({
  margin: "0 .5rem",
  cursor: "pointer",
});

const DeleteButton = styled(TextButton)({
  position: "absolute",
  bottom: 0,
  fontWeight: 400,
  fontSize: "1.15rem",
  right: 0,
});

const InputResponsiveWrapper = styled.div({
  margin: ".5rem",
  maxWidth: "14rem",
  display: "flex",
});

const TopBarRightWrapper = styled.div({
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
});

const CardWrapper = styled.div({
  padding: "1rem",
});

const Card = styled.div({
  background: "rgba(82, 82, 82, 0.79)",
  backdropFilter: "blur(40px)",
  minWidth: "calc(100% / 3)",
  padding: "1rem 1rem 2.9rem 1rem",
  position: "relative",
});

const TopBar = styled.div({
  background: "rgba(82, 82, 82, 0.5)",
  backdropFilter: "blur(40px)",
  display: "flex",
  width: "100%",
  position: "relative",
  zIndex: 10,
  alignItems: "center",
  padding: ".45rem 2rem",
  "@media (max-width: 30rem)": {
    padding: ".45rem .5rem",
  },
});

const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "column",
});

const Video = styled.video({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 0,
  objectFit: "cover",
  userSelect: "none",
  height: "100%",
  width: "100%",
});

// TODO Seperate file

const Browser = styled.div({
  display: "flex",
  overflowY: "auto",
  position: "relative",
  flexWrap: "wrap",
  flexGrow: 1,
  zIndex: 10,
  padding: "0 1.5rem",
  "@media (max-width: 30rem)": {
    padding: "0",
  },
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  "&::-webkit-scrollbar": {
    width: "14px",
  },
  "&::-webkit-scrollbar-track": {
    // borderRadius: "15rem",
    background: "rgba(82, 82, 82, 0.5)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "5rem",
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "4px solid transparent",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "3px solid transparent",
  },
});

export default Home;
