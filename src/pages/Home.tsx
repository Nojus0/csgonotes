import { Component, createSignal, For } from "solid-js";
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

const [saved, setSaved] = createSignal(true);

const Home: Component = () => {
  const [list, setList] = createStore<IListFile & { loaded: boolean }>({
    ...defaultList,
    loaded: false,
  });

  const [keys, setKeys] = createSignal<IKeyPair>();

  async function NewKeypair() {
    const PAIR = await createNewKeypair();
    await exportKeyPair(PAIR);
  }

  async function NewList() {
    const key = keys();

    if (!key) {
      return alert("Load a keypair first");
    }
    
    const enc = await encryptJsonFile(key, JSON.stringify(defaultList));
    await writeFile(enc, ".bin");
  }

  async function LoadKeypair() {
    setKeys(await loadKeyPair());
  }

  async function LoadList() {
    const k = keys();

    if (!k) return alert("Load a keypair first");

    const file = await loadFile(".bin");
    const dec = await decryptJsonFile<IListFile>(k, file);
    setList((prev) => ({ ...prev, ...dec, loaded: true }));
  }

  async function AddTodo() {
    setList("ideas", (prev) => [...prev, "New Todo"]);
  }

  async function Save() {
    const k = keys();

    if (!k) return alert("Load a keypair first");

    const enc = await encryptJsonFile(k, JSON.stringify(unwrap(list)));

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
        <button onClick={NewList}>New List</button>
      </div>
      <div>
        <button onClick={LoadKeypair}>Load Keypair</button>
        <button onClick={LoadList}>Load List</button>
      </div>
      <div>
        <p>{keys() != null ? "KeyPair Loaded" : "KeyPair Unloaded"}</p>
        <p>{list.loaded ? "List Loaded" : "List Unloaded"}</p>
      </div>
      <Browser>
        {/* <Pre>{JSON.stringify(keys(), null, 2)}</Pre> */}
        {/* <Pre>{JSON.stringify(list, null, 2)}</Pre> */}

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
