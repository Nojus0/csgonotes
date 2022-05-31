import { delMany } from "idb-keyval";
import { batch, Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { defaultKeyPairStore, KeyPairStore } from "../../common/crypto/keypair";
import { defaultListStore, ListFileStore } from "../../common/crypto/listfile";
import { getRandomScene, IScene } from "../../common/scene";

export const StateContext =
  createContext<ReturnType<typeof createDefaultStore>>();

function createDefaultStore() {
  const [store, s] = createStore({
    keypair: defaultKeyPairStore(),
    list: defaultListStore(),
    scene: getRandomScene(),
    muted: false,
    showRestore: false,
    showVideo: false,
    showCopyClipboard: false,
    mute() {
      s("mute", true);
    },
    setCopyClipboard(val: boolean) {
      s("showCopyClipboard", val);
    },
    setVideo(val: boolean) {
      console.log(`setting`, val);
      s("showVideo", val);
    },
    setRestore(val: boolean) {
      s("showRestore", val);
    },
    toggleMute() {
      s("mute", (p) => !p);
    },
    setKeyPair(keypair: KeyPairStore) {
      s("keypair", keypair);
    },
    setList(list: ListFileStore) {
      s("list", list);
    },
    setListName(name: string) {
      s("list", "name", name);
    },
    setScene(scene: IScene) {
      s("scene", scene);
    },
    newIdea() {
      s("list", "ideas", (prev) => [...prev, "New Todo"]);
    },
    updateIdeaText(idx: number, text: string) {
      s("list", "ideas", idx, text);
    },
    resetCredentials(replaceUrl: boolean = true) {
      if (replaceUrl) history.replaceState(null, "", location.origin);

      batch(() => {
        store.setKeyPair(defaultKeyPairStore());
        store.setList(defaultListStore());
      });
      delMany(["keypair", "list"]);
    },
    deleteIdea(delIdx: number) {
      s("list", "ideas", (prev) => prev.filter((t, idx) => idx != delIdx));
    },
  });

  return store;
};

export const StateContextProvider: Component = (p) => {
  const store = createDefaultStore();

  return (
    <StateContext.Provider value={store}>{p.children}</StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
