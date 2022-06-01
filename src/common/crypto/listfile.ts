import base58 from "bs58";
import { get, set } from "idb-keyval";
import { decryptJsonObject, encryptJsonObject } from ".";
import { playErrorSound } from "../audio/error";
import { DEBUG_ALL_LOADED } from "../debug";
import { endings, loadFile, mime } from "../filesystem";
import { ILoaded } from "../utils";
import { KeyPair } from "./keypair";

export interface List {
  ideas: string[];
  name: string;
}

export type ListFileStore = List & ILoaded & { handle: FileSystemFileHandle }

export function encryptList(pair: KeyPair, s: List) {
  const a: List = {
    ideas: s.ideas,
    name: s.name,
  };

  return encryptJsonObject(pair, a);
}

export async function decryptList(
  pair: KeyPair,
  f: ArrayBuffer
): Promise<List> {
  const a = await decryptJsonObject<List>(pair, f);

  return {
    ideas: a.ideas,
    name: a.name,
  }
}

export function createNewList(): List {
  return {
    ideas: ["Start typing here..."],
    name: "",
  };
}

export function defaultListStore(): ListFileStore {
  return {
    ...createNewList(),
    loaded: DEBUG_ALL_LOADED,
  } as ListFileStore
}

export function getListName() {
  const date = new Date();
  const a = crypto.getRandomValues(new Uint8Array(4));
  const id = base58.encode(a);
  const name = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-List-${id}.bin`;
  return name;
}
