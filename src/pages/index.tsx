/* @refresh reload */
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
  IListFile,
  ListFileStore,
} from "../components/ListFile";
import { createStore, unwrap } from "solid-js/store";
import {
  createNewKeypair,
  defaultKeyPairStore,
  exportKeyPair,
  KeyPairStore,
  loadKeyPair,
} from "../components/KeyPair";
import { loadFile, writeFile } from "../components/filesystem-abstract";
import { decryptJsonFile, encryptJsonFile } from "../components/Crypto";
import { GreenButton, TextButton } from "../components/Button";
import { Input, TextArea } from "../components/Input";
import { userInteracted } from "../utils/ChromeAudio";
import { ButtonSounds } from "../utils/ButtonSounds";
import { getRandomScene, IScene, Scenes } from "../utils/RandomScene";
import { preloadPrimitiveAudio, preloadAudio } from "../utils/Audio";

const Home: Component = () => {
  const [liststore, setList] = createStore<ListFileStore>(defaultListStore());
  const [keystore, setKeys] = createStore<KeyPairStore>(defaultKeyPairStore());
  const [SCENE, setScene] = createSignal<IScene>(getRandomScene());
  const [muted, setMuted] = createSignal(false);

  let i = 0;

  onMount(() => {
    preloadPrimitiveAudio();
    preloadAudio(SCENE().audio);
  });

  addEventListener("keyup", (e) => {
    if (e.key == "n") {
      setScene(Scenes[i]);
      i = (i + 1) % Scenes.length;
      ButtonSounds.onClick();
    }

    if (e.key == "b") {
      // Roll over
      if (i < 1) i = Scenes.length - 1;

      setScene(Scenes[i]);
      i = (i - 1) % Scenes.length;
      ButtonSounds.onClick();
    }

    if (e.key == "m") {
      setMuted((prev) => !prev);
    }
  });

  async function NewKeypair() {
    ButtonSounds.onClick();

    const PAIR = await createNewKeypair();
    await exportKeyPair(PAIR);
  }

  async function NewList() {
    ButtonSounds.onClick();

    const enc = await encryptJsonFile(
      keystore,
      JSON.stringify(createNewList())
    );
    await writeFile(enc, ".bin");
  }

  async function LoadKeypair() {
    ButtonSounds.onClick();

    const kp = await loadKeyPair();
    setKeys((prev) => ({ ...prev, ...kp, loaded: true }));
  }

  async function LoadList() {
    ButtonSounds.onClick();

    const file = await loadFile(".bin");
    const dec = await decryptJsonFile<IListFile>(keystore, file);
    setList((prev) => ({ ...prev, ...dec, loaded: true }));
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

    await writeFile(enc, ".bin");
  }

  function Unload() {
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

  function sourceChanged(e: HTMLVideoElement | HTMLAudioElement) {
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
        ref={sourceChanged}
        loop
        autoplay
        muted
        draggable={false}
      >
        <source type="video/webm" src={SCENE().video} />
      </Video>

      <Show when={userInteracted() && !muted()}>
        <audio ref={sourceChanged} loop autoplay>
          <source type="audio/ogg" src={SCENE().audio} />
        </audio>
      </Show>

      <TopBar>
        {!keystore.loaded && !liststore.loaded && (
          <GreenButton {...ButtonSounds} onClick={LoadKeypair}>
            Load Keypair
          </GreenButton>
        )}

        {keystore.loaded && !liststore.loaded && (
          <>
            <GreenButton {...ButtonSounds} onClick={LoadList}>
              Load List
            </GreenButton>
            <GreenButton {...ButtonSounds} onClick={NewList}>
              New List
            </GreenButton>
          </>
        )}

        {liststore.loaded && (
          <>
            <GreenButton
              {...ButtonSounds}
              padding=".75rem 1.75rem"
              onClick={AddTodo}
            >
              Add
            </GreenButton>
            <GreenButton
              {...ButtonSounds}
              padding=".75rem 1.75rem"
              onClick={Save}
            >
              Save
            </GreenButton>
          </>
        )}

        {!keystore.loaded && (
          <GreenButton {...ButtonSounds} onClick={NewKeypair}>
            New Keypair
          </GreenButton>
        )}

        <Show when={keystore.loaded && liststore.loaded}>
          <FlexGrowWrapper>
            <Input
              value={liststore.name}
              placeholder="List name"
              onInput={(e) => setList("name", e.currentTarget.value)}
            />
          </FlexGrowWrapper>
          <TextButton {...ButtonSounds} onClick={Unload}>
            Unload
          </TextButton>
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
                  <DeleteButton
                    padding=".5rem 1rem"
                    {...ButtonSounds}
                    onClick={() => Delete(i)}
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

const DeleteButton = styled(TextButton)({
  position: "absolute",
  bottom: 0,
  fontWeight: 400,
  fontSize: "1.15rem",
  right: 0,
});

const FlexGrowWrapper = styled.div({
  flexGrow: 1,
  display: "flex",
});

const CardWrapper = styled.div({
  padding: "1rem",
});

const Card = styled.div({
  background: "rgba(82, 82, 82, 0.79)",
  backdropFilter: "blur(40px)",
  minWidth: "calc(100% / 3)",
  padding: "1rem",
});

const TopBar = styled.div({
  background: "rgba(82, 82, 82, 0.5)",
  backdropFilter: "blur(40px)",
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  alignItems: "center",
  padding: "1rem 2rem",
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
  padding: "0 1.5rem",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    // borderRadius: "15rem",
    background: "rgba(82, 82, 82, 0.5)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "5rem",
    background: "#2e2e2e",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#2e2e2e",
  },
});

export default Home;
