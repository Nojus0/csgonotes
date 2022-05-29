import base58 from "bs58";
import { playErrorSound } from "../audio/error";
import { DEBUG_ALL_LOADED } from "../debug";
import { endings, loadFile, mime } from "../filesystem";
import { ILoaded } from "../utils";
import { decryptList, KeyPair } from "./keypair";

export interface List {
  ideas: string[];
  name: string;
}

export type ListFileStore = List & ILoaded & { handle: FileSystemFileHandle };

export function createNewList(): List {
  return {
    ideas: ["Start typing here..."],
    name: "",
  };
}

export async function loadList(
  pair: KeyPair
): Promise<[List, FileSystemFileHandle] | null> {
  const [file, handle] = await loadFile(mime.bin, endings.bin, "list");
  try {
    const a = await decryptList(pair, file);
    const b: List = {
      ideas: a.ideas,
      name: a.name,
    };
    return [b, handle];
  } catch (err) {
    return null;
  }
}

export function defaultListStore(): ListFileStore {
  return {
    ...createNewList(),
    loaded: DEBUG_ALL_LOADED,
    handle: null,
  };
}

export function getListName() {
  const date = new Date();
  const a = crypto.getRandomValues(new Uint8Array(4));
  const id = base58.encode(a);
  const name = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-List-${id}.bin`;
  return name;
}
