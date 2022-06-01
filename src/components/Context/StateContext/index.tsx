import { delMany, get, set } from "idb-keyval";
import {
  batch,
  Component,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { buttonSounds } from "../../../common/audio/button";
import { playErrorSound } from "../../../common/audio/error";
import {
  encryptJsonObject,
  READ_ONLY,
  READ_WRITE,
} from "../../../common/crypto";
import {
  createNewKeypair,
  decodeSerializedKeypairBuffer,
  defaultKeyPairStore,
  deserializeKeyPair,
  exportKeyPair,
  KeyPairStore,
} from "../../../common/crypto/keypair";
import {
  createNewList,
  decryptList,
  defaultListStore,
  encryptList,
  getListName,
  ListFileStore,
} from "../../../common/crypto/listfile";
import {
  endings,
  loadFile,
  mime,
  queryPermission,
  writeFile,
} from "../../../common/filesystem";

export const StateContext =
  createContext<ReturnType<typeof createDefaultStore>>();

function createDefaultStore() {
  const [ctx, s] = createStore({
    keypair: defaultKeyPairStore(),
    list: defaultListStore(),
    muted: false,
    showRestore: false,
    showVideo: false,
    showTopbar: true,
    showCopyClipboard: false,
    mute() {
      s("muted", true);
    },
    async restoreSession() {
      buttonSounds.onClick();

      let success = await ctx.loadKeyPair();
      if (!success) return;

      success = await ctx.loadList();
      if (!success) return;

      ctx.setRestore(false);
    },
    async saveList() {
      const cipher = await encryptList(ctx.keypair, ctx.list);

      if (ctx.list.handle) {
        const result = await queryPermission(ctx.list.handle, "readwrite");

        if (result == "DENIED") {
          return playErrorSound();
        }

        const w = await ctx.list.handle.createWritable();
        await w.write(cipher);
        await w.close();
        console.log(`Successfully saved`);
      } else {
        console.log(`List handle not found.`);
        await writeFile(cipher, mime.bin, endings.bin, getListName(), "list");
      }
    },
    async loadKeyPair(): Promise<boolean> {
      const idbKeypairHandle: FileSystemFileHandle = await get("keypair");

      if (!idbKeypairHandle) {
        const [jsonBuffer, handle] = await loadFile(
          mime.json,
          endings.json,
          "keypair"
        );
        await set("keypair", handle);

        const keypair = await deserializeKeyPair(
          decodeSerializedKeypairBuffer(jsonBuffer)
        );
        ctx.setKeyPair({ ...keypair, loaded: true, handle });
        return true;
      }

      const result = await queryPermission(idbKeypairHandle, "read");

      if (result == "DENIED") {
        return false;
      }

      if (result == "ALLOWED_PROMPT") {
        buttonSounds.onClick();
      }

      const file = await idbKeypairHandle.getFile();

      const { iv, key, version } = await deserializeKeyPair(
        decodeSerializedKeypairBuffer(await file.arrayBuffer())
      );

      ctx.setKeyPair({
        iv,
        key,
        version,
        handle: idbKeypairHandle,
        loaded: true,
      });
      return true;
    },
    async loadList(): Promise<boolean> {
      const idbListHandle: FileSystemFileHandle = await get("list");
      if (!idbListHandle) {
        const [cipherBuffer, handle] = await loadFile(
          mime.bin,
          endings.bin,
          "list"
        );
        await set("list", handle);

        const list = await decryptList(ctx.keypair, cipherBuffer);
        ctx.setList({ ...list, loaded: true, handle });
        return true;
      }

      const result = await queryPermission(idbListHandle, "readwrite");
      if (result == "DENIED") {
        return false;
      }

      if (result == "ALLOWED_PROMPT") {
        buttonSounds.onClick();
      }

      const file = await idbListHandle.getFile();
      const list = await decryptList(ctx.keypair, await file.arrayBuffer());

      ctx.setList({
        ...list,
        handle: idbListHandle,
        loaded: true,
      });
      return true;
    },
    async newList() {
      const NEW_LIST = createNewList();
      const enc = await encryptJsonObject(ctx.keypair, NEW_LIST);

      const handle = await writeFile(
        enc,
        mime.bin,
        endings.bin,
        getListName(),
        "list"
      );
      set("list", handle);
      ctx.setList({ ...NEW_LIST, handle, loaded: true });
    },
    async newKeypair() {
      const NEW_PAIR = await createNewKeypair();
      const handle = await exportKeyPair(NEW_PAIR);
      set("keypair", handle);
      ctx.setKeyPair({ ...NEW_PAIR, handle, loaded: true });
    },
    setShowTopbar(val: boolean) {
      s("showTopbar", val);
    },
    setCopyClipboard(val: boolean) {
      s("showCopyClipboard", val);
    },
    setVideo(val: boolean) {
      s("showVideo", val);
    },
    setRestore(val: boolean) {
      s("showRestore", val);
    },
    toggleMute() {
      s("muted", (p) => !p);
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
    newIdea() {
      s("list", "ideas", (prev) => [...prev, "New Todo"]);
    },
    updateIdeaText(idx: number, text: string) {
      s("list", "ideas", idx, text);
    },
    resetCredentials(replaceUrl: boolean = true) {
      if (replaceUrl) history.replaceState(null, "", location.origin);

      batch(() => {
        ctx.setKeyPair(defaultKeyPairStore());
        ctx.setList(defaultListStore());
      });
      delMany(["keypair", "list"]);
    },
    deleteIdea(delIdx: number) {
      s("list", "ideas", (prev) => prev.filter((t, idx) => idx != delIdx));
    },
  });

  return ctx;
}

export const StateContextProvider: Component = (p) => {
  const store = createDefaultStore();

  return (
    <StateContext.Provider value={store}>{p.children}</StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
