import base58 from "bs58";
import { get, set } from "idb-keyval";
import { playErrorSound } from "../audio/error";
import { DEBUG_ALL_LOADED } from "../debug";
import { endings, loadFile, mime } from "../filesystem";
import { ILoaded } from "../utils";
import { decryptList, KeyPair } from "./keypair";

export interface List {
  ideas: string[];
  name: string;
}

export type ListFileStore = List & ILoaded

export function createNewList(): List {
  return {
    ideas: ["Start typing here..."],
    name: "",
  };
}

async function resolveListfile(): Promise<ArrayBuffer> {
  const listHandle: FileSystemFileHandle = await get("list");

  if (listHandle == null) {
    const [bin, handle] = await loadFile(mime.bin, endings.bin, "list");
    await set("list", handle);
    return bin;
  }

  if ((await listHandle.queryPermission({ mode: "readwrite" })) == "prompt") {
    await listHandle.requestPermission({ mode: "readwrite" });
    set("list", listHandle)
  }

  // * If does not have permission exception will be thrown. *
  return (await listHandle.getFile()).arrayBuffer()
}

export async function loadList(
  pair: KeyPair
): Promise<List | null> {
  const file = await resolveListfile()
  try {
    const a = await decryptList(pair, file);
    return {
      ideas: a.ideas,
      name: a.name,
    }
  } catch (err) {
    return null;
  }
}

export function defaultListStore(): ListFileStore {
  return {
    ...createNewList(),
    loaded: DEBUG_ALL_LOADED,
  };
}

export function getListName() {
  const date = new Date();
  const a = crypto.getRandomValues(new Uint8Array(4));
  const id = base58.encode(a);
  const name = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-List-${id}.bin`;
  return name;
}
