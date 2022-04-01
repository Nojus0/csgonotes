import { DEBUG_ALL_LOADED } from "../utils/debug";
import { ILoaded } from "./utils";

export interface IListFile {
  ideas: string[];
  name: string;
}

export type ListFileStore = IListFile & ILoaded;

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
  };
}
