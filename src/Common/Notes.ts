import {decryptJsonObject, encryptJsonObject} from "@Common/Crypto";
import base58 from "bs58";
import {DEBUG_ALL_LOADED} from "@Common/Debug";
import {KeyPair} from "@Common/KeyPair";
import {ILoaded} from "@Common/Utils";

export interface Notes {
    ideas: string[];
    name: string;
}

export type NotesFileStore = Notes & ILoaded & { handle: FileSystemFileHandle }

export function encryptNotes(pair: KeyPair, s: Notes) {
    const a: Notes = {
        ideas: s.ideas,
        name: s.name,
    };

    return encryptJsonObject(pair, a);
}

export async function decryptNotes(
    pair: KeyPair,
    f: ArrayBuffer
): Promise<Notes> {
    const a = await decryptJsonObject<Notes>(pair, f);

    return {
        ideas: a.ideas,
        name: a.name,
    }
}

export function createNewNotes(): Notes {
    return {
        ideas: ["Start typing here..."],
        name: "",
    };
}

export function defaultNotesStore(): NotesFileStore {
    return {
        ...createNewNotes(),
        loaded: DEBUG_ALL_LOADED,
    } as NotesFileStore
}

export function getNotesName() {
    const date = new Date();
    const a = crypto.getRandomValues(new Uint8Array(4));
    const id = base58.encode(a);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-Notes-${id}.bin`;
}
