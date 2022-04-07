import base58 from "bs58";
import { DEBUG_ALL_LOADED } from "../debug";
import { ILoaded } from "../utils";

export interface IListFile {
  ideas: string[];
  name: string;
}

export type ListFileStore = IListFile &
  ILoaded & { handle: FileSystemFileHandle };

export function createNewList(): IListFile {
  return {
    ideas: ["Start typing here..."],
    name: "",
  };
}

export function defaultListStore(): ListFileStore {
  return {
    ideas: ["Start typing here..."],
    loaded: DEBUG_ALL_LOADED,
    name: "",
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
