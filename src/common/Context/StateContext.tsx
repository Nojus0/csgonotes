import { delMany, get, set } from "idb-keyval";
import {
  batch,
  Component,
  createContext,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { encryptJsonObject } from "@common/Crypto";
import {
  createNewKeypair,
  decodeSerializedKeypairBuffer,
  defaultKeyPairStore,
  deserializeKeyPair,
  exportKeyPair,
  KeyPairStore,
} from "@common/KeyPair";

import {
  endings,
  loadFile,
  mime,
  queryPermission,
  writeFile,
} from "@common/Filesystem";
import { buttonSounds, playErrorSound } from "@common/Audio/AudioSource";
import {
  createNewNotes,
  decryptNotes,
  defaultNotesStore,
  encryptNotes,
  getNotesName,
  NotesFileStore,
} from "@common/Notes";

export const StateContext =
  createContext<ReturnType<typeof createDefaultStore>>();

function createDefaultStore() {
  const [ctx, s] = createStore({
    keypair: defaultKeyPairStore(),
    notes: defaultNotesStore(),
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
      if (!success) return playErrorSound();

      success = await ctx.loadNotes();
      if (!success) return playErrorSound();

      ctx.setRestore(false);
    },
    async saveNotes() {
      const cipher = await encryptNotes(ctx.keypair, ctx.notes);

      if (ctx.notes.handle) {
        const result = await queryPermission(ctx.notes.handle, "readwrite");

        if (result == "DENIED") {
          return playErrorSound();
        }

        const w = await ctx.notes.handle.createWritable();
        await w.write(cipher);
        await w.close();
        console.log(`Successfully saved`);
      } else {
        console.log(`List handle not found.`);
        await writeFile(cipher, mime.bin, endings.bin, getNotesName(), "list");
      }
    },
    async loadKeyPair(): Promise<boolean> {
      try {
        const idbKeypairHandle: FileSystemFileHandle = await get("keypair");

        if (!idbKeypairHandle) {
          const [jsonBuffer, handle] = await loadFile(
            mime.json,
            endings.json,
            "keypair"
          );
          try {
            const keypair = await deserializeKeyPair(
              decodeSerializedKeypairBuffer(jsonBuffer)
            );
            await set("keypair", handle);
            ctx.setKeyPair({ ...keypair, loaded: true, handle });
            return true;
          } catch (err) {
            playErrorSound();
            throw new Error("Incorrect keypair");
          }
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
      } catch (err) {
        return false;
      }
    },
    async loadNotes(): Promise<boolean> {
      try {
        const idbListHandle: FileSystemFileHandle = await get("list");
        if (!idbListHandle) {
          const [cipherBuffer, handle] = await loadFile(
            mime.bin,
            endings.bin,
            "list"
          );
          try {
            const list = await decryptNotes(ctx.keypair, cipherBuffer);
            await set("list", handle);
            ctx.setNotes({ ...list, loaded: true, handle });
            return true;
          } catch (err) {
            playErrorSound();
            throw new Error("List file does not match keypair.");
          }
        }

        const result = await queryPermission(idbListHandle, "readwrite");
        if (result == "DENIED") {
          return false;
        }

        if (result == "ALLOWED_PROMPT") {
          buttonSounds.onClick();
        }

        const file = await idbListHandle.getFile();

        try {
          const list = await decryptNotes(ctx.keypair, await file.arrayBuffer());
          ctx.setNotes({
            ...list,
            handle: idbListHandle,
            loaded: true,
          });
          return true;
        } catch (err) {
          playErrorSound();
          throw new Error("List file does not match keypair.");
        }
      } catch (err) {
        return false;
      }
    },
    async newNotes() {
      const NEW_LIST = createNewNotes();
      const enc = await encryptJsonObject(ctx.keypair, NEW_LIST);

      const handle = await writeFile(
        enc,
        mime.bin,
        endings.bin,
        getNotesName(),
        "list"
      );
      set("list", handle);
      ctx.setNotes({ ...NEW_LIST, handle, loaded: true });
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
    setNotes(list: NotesFileStore) {
      s("notes", list);
    },
    setNotesName(name: string) {
      s("notes", "name", name);
    },
    newIdea() {
      s("notes", "ideas", (prev) => [...prev, "New Note."]);
    },
    updateIdeaText(idx: number, text: string) {
      s("notes", "ideas", idx, text);
    },
    resetCredentials(replaceUrl: boolean = true) {
      if (replaceUrl) history.replaceState(null, "", location.origin);

      batch(() => {
        ctx.setKeyPair(defaultKeyPairStore());
        ctx.setNotes(defaultNotesStore());
      });
      delMany(["keypair", "list"]);
    },
    deleteIdea(delIdx: number) {
      s("notes", "ideas", (prev) => prev.filter((t, idx) => idx != delIdx));
    },
  });

  return ctx;
}

export const StateContextProvider: Component<{ children: any }> = (p) => {
  const store = createDefaultStore();

  return (
    <StateContext.Provider value={store}>{p.children}</StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
