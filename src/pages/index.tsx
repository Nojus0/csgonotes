import {
  Accessor,
  batch,
  Component,
  createEffect,
  createSignal,
  For,
  on,
  onMount,
  Show,
} from "solid-js";
import { styled } from "solid-styled-components";
import {
  createNewList,
  defaultListStore,
  getListName,
  IListFile,
  ListFileStore,
} from "../common/crypto/listfile";
import { createStore, unwrap } from "solid-js/store";
import {
  createNewKeypair,
  defaultKeyPairStore,
  exportKeyPair,
  KeyPairStore,
  loadKeyPair,
} from "../common/crypto/keypair";
import { loadFile, writeFile } from "../common/filesystem";
import { decryptJsonFile, encryptJsonFile } from "../common/crypto";
import { GreenButton, TextButton } from "../components/Button";
import { Input, TextArea } from "../components/Input";
import { userInteracted } from "../common/audio/chrome";
import { ButtonSounds } from "../common/audio/button";
import { getRandomScene, IScene, Scenes } from "../common/scene";
import { preloadPrimitiveAudio, preloadAudio } from "../common/audio";
import QuitIcon from "../components/QuitIcon";
import SettingsIcon from "../components/SettingsIcon";
import SaveIcon from "../components/SaveIcon";
import { playErrorSound } from "../common/audio/error";

const Home: Component = () => {
  const [liststore, setList] = createStore<ListFileStore>(defaultListStore());
  const [keystore, setKeys] = createStore<KeyPairStore>(defaultKeyPairStore());
  const [SCENE, setScene] = createSignal<IScene>(getRandomScene());
  const [muted, setMuted] = createSignal(false);
  let i = 0;

  onMount(() => {
    preloadPrimitiveAudio();
    preloadAudio(SCENE().audio);
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
        ButtonSounds.onClick();
        break;

      case "b":
        i = i < 1 ? Scenes.length - 1 : (i - 1) % Scenes.length;
        setScene(Scenes[i]);
        ButtonSounds.onClick();
        break;

      case "m":
        setMuted((prev) => !prev);
        ButtonSounds.onClick();
        break;
    }
  }

  async function NewKeypair() {
    ButtonSounds.onClick();

    const PAIR = await createNewKeypair();
    await exportKeyPair(PAIR);

    setKeys({ ...PAIR, loaded: true });
  }

  async function NewList() {
    ButtonSounds.onClick();

    const LIST = createNewList();
    const enc = await encryptJsonFile(keystore, JSON.stringify(LIST));
    const handle = await writeFile(enc, getListName(), ".bin");

    setList({ ...LIST, handle, loaded: true });
  }

  async function LoadKeypair() {
    ButtonSounds.onClick();

    const kp = await loadKeyPair();
    setKeys({ ...kp, loaded: true });
  }

  async function LoadList() {
    ButtonSounds.onClick();

    const [file, handle] = await loadFile(".bin");
    try {
      const dec = await decryptJsonFile<IListFile>(keystore, file);
      setList({ ...dec, loaded: true, handle });
    } catch (err) {
      playErrorSound();
    }
  }

  async function AddTodo() {
    ButtonSounds.onClick();
    setList("ideas", (prev) => [...prev, "New Todo"]);
  }

  async function Save() {
    ButtonSounds.onClick();

    const enc = await encryptJsonFile(
      keystore,
      JSON.stringify(unwrap(liststore))
    );

    if (!liststore.handle) return await writeFile(enc, getListName(), ".bin");

    const writable = await liststore.handle.createWritable();
    await writable.write(enc);
    await writable.close();
  }

  function Unload(e: MouseEvent) {
    ButtonSounds.onClick();

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

  return (
    <Container>
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

      <Show when={userInteracted() && !muted()}>
        <audio ref={onSourceChange} loop autoplay>
          <source type="audio/ogg" src={SCENE().audio} />
        </audio>
      </Show>

      <TopBar>
        {!keystore.loaded && !liststore.loaded && (
          <GreenButton onClick={LoadKeypair}>Load Keypair</GreenButton>
        )}

        {keystore.loaded && !liststore.loaded && (
          <>
            <GreenButton onClick={LoadList}>Load List</GreenButton>
            <GreenButton onClick={NewList}>New List</GreenButton>
          </>
        )}

        {liststore.loaded && (
          <>
            <AdaptiveGreenButton onClick={AddTodo}>Add</AdaptiveGreenButton>
            <AdaptiveGreenButton onClick={Save}>
              <SaveMargined height="1.2rem" />
              Save
            </AdaptiveGreenButton>
          </>
        )}

        {!keystore.loaded && (
          <GreenButton onClick={NewKeypair}>New Keypair</GreenButton>
        )}

        <Show when={keystore.loaded && liststore.loaded}>
          <TopBarRightWrapper>
            <InputResponsiveWrapper>
              <Input
                width="100%"
                margin="0"
                value={liststore.name}
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
        <Show when={liststore.loaded}>
          <For each={liststore.ideas}>
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
