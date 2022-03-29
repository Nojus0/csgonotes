import { Component, createSignal, For, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { defaultList, IListFile } from "../components/ListFile";
import { createStore, unwrap } from "solid-js/store";
import {
  createNewKeypair,
  exportKeyPair,
  IKeyPair,
  loadKeyPair,
} from "../components/KeyPair";
import { loadFile, writeFile } from "../components/filesystem-abstract";
import { decryptJsonFile, encryptJsonFile } from "../components/Crypto";
import { ILoaded } from "../components/utils";

const [saved, setSaved] = createSignal(true);

const Home: Component = () => {
  const [list, setList] = createStore<IListFile & { loaded: boolean }>({
    ...defaultList,
    loaded: false,
  });

  const [keys, setKeys] = createStore<IKeyPair & ILoaded>({
    iv: null as any,
    key: null as any,
    loaded: false,
  });

  async function NewKeypair() {
    const PAIR = await createNewKeypair();
    await exportKeyPair(PAIR);
  }

  async function NewList() {
    const enc = await encryptJsonFile(keys, JSON.stringify(defaultList));
    await writeFile(enc, ".bin");
  }

  async function LoadKeypair() {
    const kp = await loadKeyPair();

    setKeys((prev) => ({ ...prev, ...kp, loaded: true }));
  }

  async function LoadList() {
    const file = await loadFile(".bin");
    const dec = await decryptJsonFile<IListFile>(keys, file);
    setList((prev) => ({ ...prev, ...dec, loaded: true }));
  }

  async function AddTodo() {
    setList("ideas", (prev) => [...prev, "New Todo"]);
  }

  async function Save() {
    const enc = await encryptJsonFile(keys, JSON.stringify(unwrap(list)));

    await writeFile(enc, ".bin");
  }

  return (
    <>
      <button onClick={AddTodo}>Add new Todo</button>
      <button onClick={Save}>Save</button>
      <input
        value={list.name}
        onInput={(e) => setList("name", e.currentTarget.value)}
      />
      <div>
        <button onClick={NewKeypair}>New Keypair</button>
        <Show when={keys.loaded}>
          <button onClick={NewList}>New List</button>
        </Show>
      </div>
      <div>
        <button onClick={LoadKeypair}>Load Keypair</button>
        <Show when={keys.loaded}>
          <button onClick={LoadList}>Load List</button>
        </Show>
      </div>
      <Browser>
        {/* <Pre>{JSON.stringify(keys(), null, 2)}</Pre> */}
        {/* <Pre>{JSON.stringify(list, null, 2)}</Pre> */}
        <Show when={list.loaded}>
          <For each={list.ideas}>
            {(todo, i) => (
              <TodoContainer>
                <TextField
                  value={todo}
                  onChange={(e) => setList("ideas", i(), e.currentTarget.value)}
                />
                <button
                  onClick={() =>
                    setList("ideas", (prev) =>
                      prev.filter((t, ind) => ind != i())
                    )
                  }
                >
                  X
                </button>
              </TodoContainer>
            )}
          </For>
        </Show>
      </Browser>
    </>
  );
};

const TextField = styled.textarea({
  flexGrow: 1,
});

const TodoContainer = styled.div({
  display: "flex",
  width: "100%",
  margin: ".5rem 0",
});

const Pre = styled.pre({
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
});

const Browser = styled.div({
  display: "flex",
  width: "100%",
  flexDirection: "column",
});

export default Home;
