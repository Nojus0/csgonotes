/* @refresh reload */

import { batch, Component, For, Show } from "solid-js";
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
import { Input } from "../components/Input";
import { userInteracted } from "../utils/ChromeAudio";
import { ButtonSounds } from "../utils/ButtonSounds";
import { PlaySync } from "../utils/Audio";

const Home: Component = () => {
  const [liststore, setList] = createStore<ListFileStore>(defaultListStore());
  const [keystore, setKeys] = createStore<KeyPairStore>(defaultKeyPairStore());

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

  return (
    <Container>
      <Video autoplay muted draggable={false}>
        <source type="video/webm" src="/video/vertigo540.webm" />
      </Video>

      <Show when={userInteracted()}>
        <audio loop autoplay>
          <source type="audio/ogg" src="/sound/bg_vertigo_01.ogg" />
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
                  <TextField
                    cols={30}
                    rows={10}
                    value={todo}
                    onChange={(e) =>
                      setList("ideas", i(), e.currentTarget.value)
                    }
                  />
                  {/* <button
                  onClick={() =>
                    setList("ideas", (prev) =>
                      prev.filter((t, ind) => ind != i())
                    )
                  }
                >
                  X
                </button> */}
                </Card>
              </CardWrapper>
            )}
          </For>
        </Show>
      </Browser>
    </Container>
  );
};

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

const ImageBackground = styled.img({
  backgroundSize: "cover",
  position: "absolute",
  top: 0,
  objectFit: "fill",
  // filter: "blur(10px)",
  // transform: "scale(1.1)",
  left: 0,
  userSelect: "none",
  height: "100%",
  width: "100%",
  backgroundRepeat: "no-repeat",
});

// TODO Seperate file
const TextField = styled.textarea({
  resize: "none",
  height: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "white",
  fontSize: "1.75rem",
});

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
});

export default Home;
