import { delMany, get, set } from "idb-keyval"
import { batch, Component, createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { encryptJsonObject } from "@Common/Crypto"
import {
  createNewKeypair,
  decodeSerializedKeypairBuffer,
  defaultKeyPairStore,
  deserializeKeyPair,
  exportKeyPair,
  KeyPairStore,
} from "@Common/KeyPair"
import {
  endings,
  loadFile,
  mime,
  queryPermission,
  writeFile,
} from "@Common/Filesystem"
import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import {
  createNewNotes,
  decryptNotes,
  defaultNotesStore,
  encryptNotes,
  getNotesName,
  NotesFileStore,
} from "@Common/Notes"
import { isHashSerialized } from "@Components/CopyBackdrop"

export const StateContext =
  createContext<ReturnType<typeof createDefaultStore>>()

function createDefaultStore() {
  const [ctx, s] = createStore({
    keypair: defaultKeyPairStore(),
    notes: defaultNotesStore(),
    muted: false,
    showRestore: false,
    showCompatibility: false,
    showVideo: false,
    showTopbar: isHashSerialized() == null,
    showCopyClipboard: false,
    mute() {
      s("muted", true)
    },
    setCompatability(val: boolean) {
      s("showCompatibility", val)
    },
    async restoreSession() {
      buttonSounds.onClick()

      await ctx.loadKeyPair()
      await ctx.loadNotes()

      ctx.setRestore(false)
    },
    async saveNotes() {
      const cipher = await encryptNotes(ctx.keypair, ctx.notes)

      if (ctx.notes.handle) {
        const result = await queryPermission(ctx.notes.handle, "readwrite")

        if (result == "DENIED") {
          return playErrorSound()
        }

        const w = await ctx.notes.handle.createWritable()
        await w.write(cipher)
        await w.close()
        console.log(`Successfully saved`)
      } else {
        console.log(`Notes handle not found.`)
        await writeFile(cipher, mime.bin, endings.bin, getNotesName(), "notes")
      }
    },
    async loadKeyPairNoIDB() {
      const [jsonBuffer, handle] = await loadFile(
        mime.json,
        endings.json,
        "keypair"
      )
      try {
        const keypair = await deserializeKeyPair(
          decodeSerializedKeypairBuffer(jsonBuffer)
        )
        await set("keypair", handle)
        ctx.setKeyPair({ ...keypair, loaded: true, handle })
      } catch (err) {
        throw new Error("Incorrect keypair")
      }
    },
    async loadKeyPairViaIDB(idbKeypairHandle: FileSystemFileHandle) {
      const result = await queryPermission(idbKeypairHandle, "read")

      if (result == "DENIED") throw new Error("Denied access to keypair handle")

      if (result == "ALLOWED_PROMPT") {
        buttonSounds.onClick()
      }

      const file = await idbKeypairHandle.getFile()

      const { iv, key, version } = await deserializeKeyPair(
        decodeSerializedKeypairBuffer(await file.arrayBuffer())
      )

      ctx.setKeyPair({
        iv,
        key,
        version,
        handle: idbKeypairHandle,
        loaded: true,
      })
    },
    async loadKeyPair() {
      const idbKeypairHandle: FileSystemFileHandle = await get("keypair")
      if (!idbKeypairHandle) {
        return await ctx.loadKeyPairNoIDB()
      }

      return await ctx.loadKeyPairViaIDB(idbKeypairHandle)
    },
    async loadNotesNoIDB() {
      const [cipherBuffer, handle] = await loadFile(
        mime.bin,
        endings.bin,
        "notes"
      )
      try {
        const notes = await decryptNotes(ctx.keypair, cipherBuffer)
        await set("notes", handle)
        ctx.setNotes({ ...notes, loaded: true, handle })
      } catch (err) {
        throw new Error("Notes file does not match keypair.")
      }
    },
    async loadNotesViaIDB(idbNotesHandle: FileSystemFileHandle) {
      const result = await queryPermission(idbNotesHandle, "readwrite")

      if (result == "DENIED") {
        throw new Error("Denied access to file handle.")
      }

      if (result == "ALLOWED_PROMPT") {
        buttonSounds.onClick()
      }

      const file = await idbNotesHandle.getFile()

      try {
        const notes = await decryptNotes(ctx.keypair, await file.arrayBuffer())
        ctx.setNotes({
          ...notes,
          handle: idbNotesHandle,
          loaded: true,
        })
      } catch (err) {
        throw new Error("Notes file does not match keypair.")
      }
    },
    async loadNotes() {
      const idbNotesHandle: FileSystemFileHandle = await get("notes")

      if (!idbNotesHandle) {
        return await ctx.loadNotesNoIDB()
      }

      return await ctx.loadNotesViaIDB(idbNotesHandle)
    },
    async newNotes() {
      const NEW_LIST = createNewNotes()
      const enc = await encryptJsonObject(ctx.keypair, NEW_LIST)

      const handle = await writeFile(
        enc,
        mime.bin,
        endings.bin,
        getNotesName(),
        "notes"
      )
      set("notes", handle)
      ctx.setNotes({ ...NEW_LIST, handle, loaded: true })
    },
    async newKeypair() {
      const NEW_PAIR = await createNewKeypair()
      const handle = await exportKeyPair(NEW_PAIR)
      set("keypair", handle)
      ctx.setKeyPair({ ...NEW_PAIR, handle, loaded: true })
    },
    setShowTopbar(val: boolean) {
      s("showTopbar", val)
    },
    setCopyClipboard(val: boolean) {
      s("showCopyClipboard", val)
    },
    setVideo(val: boolean) {
      s("showVideo", val)
    },
    setRestore(val: boolean) {
      s("showRestore", val)
    },
    toggleMute() {
      s("muted", p => !p)
    },
    setKeyPair(keypair: KeyPairStore) {
      s("keypair", keypair)
    },
    setNotes(notes: NotesFileStore) {
      s("notes", notes)
    },
    setNotesName(name: string) {
      s("notes", "name", name)
    },
    newIdea() {
      s("notes", "ideas", prev => [...prev, "New Note."])
    },
    updateIdeaText(idx: number, text: string) {
      s("notes", "ideas", idx, text)
    },
    resetCredentials(replaceUrl: boolean = true) {
      if (replaceUrl) history.replaceState(null, "", location.origin)

      batch(() => {
        ctx.setKeyPair(defaultKeyPairStore())
        ctx.setNotes(defaultNotesStore())
      })
      delMany(["keypair", "notes"])
    },
    deleteIdea(delIdx: number) {
      s("notes", "ideas", prev => prev.filter((t, idx) => idx != delIdx))
    },
  })

  return ctx
}

export const StateContextProvider: Component<{ children: any }> = p => {
  const store = createDefaultStore()

  return (
    <StateContext.Provider value={store}>{p.children}</StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
