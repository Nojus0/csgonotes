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
  untrack,
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
import { createStore, unwrap } from "solid-js/store";
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
import { writeFile } from "../common/filesystem";
import { encryptJsonObject } from "../common/crypto";
import { GreenButton, TextButton } from "../components/Button";
import { Input, TextArea } from "../components/Input";
import { userInteracted } from "../common/audio/chrome";
import { ButtonSounds } from "../common/audio/button";
import { getRandomScene, IScene, Scenes } from "../common/scene";
import { preloadPrimitiveAudio, preloadAudio } from "../common/audio";
import QuitIcon from "../components/QuitIcon";
import SaveIcon from "../components/SaveIcon";
import { playErrorSound } from "../common/audio/error";
import Backdrop, { Description } from "../components/Backdrop";
import base58 from "bs58";

const Home: Component = () => {
  const [list, setList] = createStore<ListFileStore>(defaultListStore());
  const [pair, setKeys] = createStore<KeyPairStore>(defaultKeyPairStore());
  const [SCENE, setScene] = createSignal<IScene>(getRandomScene());
  const [muted, setMuted] = createSignal(false);

  // For initial load
  const [showVideo, setShowVideo] = createSignal(false);
  const [when, setWhen] = createSignal(false);
  let i = 0;

  onMount(async () => {
    preloadPrimitiveAudio();
    preloadAudio(SCENE().audio);
    addEventListener("keyup", onShortcutKey);
    setShowVideo(true);

    const url = new URL(location.href);
    const params = url.searchParams;

    const key = params.get("key");
    const iv = params.get("iv");
    const list = params.get("list");

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
      setKeys({ ...keypair, loaded: true });
      setList({ ...listfile, loaded: true, handle: null });
    });
  });

  onCleanup(() => {
    setShowVideo(false);
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
        ButtonSounds.onClick();
        break;

      case "b":
        i = i < 1 ? Scenes.length - 1 : (i - 1) % Scenes.length;
        setScene(Scenes[i]);
        ButtonSounds.onClick();
        break;

      case e.ctrlKey && pair.loaded && list.loaded && "c":
        setWhen(true);
        break;

      case "m":
        setMuted((prev) => !prev);
        ButtonSounds.onClick();
        break;
    }
  }
  async function NewKeypair() {
    ButtonSounds.onClick();

    const NEW_PAIR = await createNewKeypair();
    await exportKeyPair(NEW_PAIR);

    setKeys({ ...NEW_PAIR, loaded: true });
  }
  async function NewList() {
    ButtonSounds.onClick();

    const NEW_LIST = createNewList();
    const enc = await encryptJsonObject(pair, NEW_LIST);
    const handle = await writeFile(enc, getListName(), ".bin");

    setList({ ...NEW_LIST, handle, loaded: true });
  }
  async function LoadKeypair() {
    ButtonSounds.onClick();

    setKeys({ ...(await loadKeyPair()), loaded: true });
  }
  async function LoadList() {
    ButtonSounds.onClick();

    const e = await loadList(pair);

    if (e == null) return playErrorSound();
    const [listFile, handle] = e;
    setList({ ...listFile, loaded: true, handle });
  }
  async function AddTodo() {
    ButtonSounds.onClick();
    setList("ideas", (prev) => [...prev, "New Todo"]);
  }
  async function Save() {
    ButtonSounds.onClick();

    const CIPHER = await encryptList(pair, list);

    if (!list.handle) {
      const newHandle = await writeFile(CIPHER, getListName(), ".bin");
      setList("handle", newHandle);
      return;
    }

    const writable = await list.handle.createWritable();
    await writable.write(CIPHER);
    await writable.close();
  }
  function Unload(e: MouseEvent) {
    ButtonSounds.onClick();
    history.replaceState(null, "", location.origin);
    batch(() => {
      setList(defaultListStore());
      setKeys(defaultKeyPairStore());
    });
  }
  function Delete(i: Accessor<number>) {
    ButtonSounds.onClick();
    setList("ideas", (prev) => prev.filter((t, ind) => ind != i()));
  }
  function onSourceChange(e: HTMLVideoElement | HTMLAudioElement) {
    createEffect(
      on(SCENE, () => {
        e.load();
      })
    );
  }
  async function copyListToClipboard() {
    const url = new URL(location.href);
    const p = url.searchParams;
    const s = await serializeKeyPair(pair);
    p.set("key", s.key);
    p.set("iv", s.iv);
    p.set("list", base58.encode(new Uint8Array(await encryptList(pair, list))));

    navigator.clipboard.writeText(url.href);
  }
  const [text, setText] = createSignal("5");

  let timer: NodeJS.Timer;
  createEffect(() => {
    if (when()) {
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
              Convert the list and the keypair to a link.
            </Description>
            <Description>
              NOTE: Anyone with the link can access the list.
            </Description>
          </>
        }
        setWhen={setWhen}
        when={when()}
      >
        <TextButton
          onClick={() => {
            setWhen((prev) => !prev);
            ButtonSounds.onClick();
          }}
        >
          Close
        </TextButton>
        <TextButton
          onClick={() => {
            if (when() && text() == "Copy") {
              copyListToClipboard();
              ButtonSounds.onClick();
            }
          }}
        >
          {text()}
        </TextButton>
      </Backdrop>
      <Show when={showVideo()}>
        <Video
          preload="auto"
          ref={onSourceChange}
          loop
          autoplay
          muted
          draggable={false}
        >
          <source type="video/webm" src={SCENE().video} />
        </Video>
      </Show>

      <Show when={userInteracted() && !muted()}>
        <audio ref={onSourceChange} loop autoplay>
          <source type="audio/ogg" src={SCENE().audio} />
        </audio>
      </Show>

      <TopBar>
        {!pair.loaded && !list.loaded && (
          <GreenButton onClick={LoadKeypair}>Load Keypair</GreenButton>
        )}

        {pair.loaded && !list.loaded && (
          <>
            <GreenButton onClick={LoadList}>Load List</GreenButton>
            <GreenButton onClick={NewList}>New List</GreenButton>
          </>
        )}

        {list.loaded && (
          <>
            <AdaptiveGreenButton onClick={AddTodo}>Add</AdaptiveGreenButton>
            <AdaptiveGreenButton onClick={Save}>
              <SaveMargined height="1.2rem" />
              Save
            </AdaptiveGreenButton>
          </>
        )}

        {!pair.loaded && (
          <GreenButton onClick={NewKeypair}>New Keypair</GreenButton>
        )}

        <Show when={pair.loaded && list.loaded}>
          <TopBarRightWrapper>
            <InputResponsiveWrapper>
              <Input
                width="100%"
                margin="0"
                value={list.name}
                placeholder="List name"
                onInput={(e) => setList("name", e.currentTarget.value)}
              />
            </InputResponsiveWrapper>
            <Icons>
              <Quit
                {...ButtonSounds}
                onMouseDown={(e) => e.preventDefault()}
                onClick={Unload}
              />
            </Icons>
          </TopBarRightWrapper>
        </Show>
      </TopBar>
      <Browser>
        <Show when={list.loaded}>
          <For each={list.ideas}>
            {(todo, i) => (
              <CardWrapper>
                <Card>
                  <TextArea
                    cols={30}
                    rows={10}
                    value={todo}
                    onChange={(e) =>
                      setList("ideas", i(), e.currentTarget.value)
                    }
                  />
                  <DeleteButton padding=".5rem 1rem" onClick={() => Delete(i)}>
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
