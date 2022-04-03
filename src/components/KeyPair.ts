import base64 from "base64-js";
import { DEBUG_ALL_LOADED } from "../utils/debug";
import { loadJsonFile, writeFile } from "./filesystem-abstract";
import { ILoaded } from "./utils";

export const AES_IV_BYTES = 32;
export const AES_KEY_BITS = AES_IV_BYTES * 8;
export const VERSION = 1;

export interface IKeyPairSerialized {
  key: string;
  iv: string;
  version: number;
}

export interface IKeyPair {
  key: CryptoKey;
  iv: Uint8Array;
  version: number;
}

export type KeyPairStore = IKeyPair & ILoaded;

export const defaultKeyPairStore = () =>
  ({
    loaded: DEBUG_ALL_LOADED,
  } as KeyPairStore);

export const createNewKeypair = async () => {
  const CRYPTO_KEY = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: AES_KEY_BITS,
      hash: "SHA-512",
      salt: crypto.getRandomValues(new Uint8Array(AES_IV_BYTES)),
      iterations: 10000000,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const a: IKeyPair = {
    key: CRYPTO_KEY,
    version: VERSION,
    iv: crypto.getRandomValues(new Uint8Array(AES_IV_BYTES)),
  };

  return a;
};

export async function loadKeyPair() {
  const a = await loadJsonFile<IKeyPairSerialized>();

  const PAIR: IKeyPair = {
    iv: base64.toByteArray(a.iv),
    version: a.version,
    key: await crypto.subtle.importKey(
      "raw",
      base64.toByteArray(a.key),
      {
        name: "AES-GCM",
        hash: "SHA-512",
        length: AES_KEY_BITS,
      },
      true,
      ["encrypt", "decrypt"]
    ),
  };

  return PAIR;
}

export async function exportKeyPair(keypair: IKeyPair) {
  const KEY_BUF = new Uint8Array(
    await crypto.subtle.exportKey("raw", keypair.key)
  );

  const SERIALIZED_KEYPAIR: IKeyPairSerialized = {
    key: base64.fromByteArray(KEY_BUF),
    iv: base64.fromByteArray(keypair.iv),
    version: keypair.version,
  };

  await writeFile(JSON.stringify(SERIALIZED_KEYPAIR, null, 2), ".json");
}
