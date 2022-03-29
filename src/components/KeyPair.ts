import base64 from "base64-js";
import { loadJsonFile, writeFile } from "./filesystem-abstract";

export const AES_IV_BYTES = 128;
export const AES_KEY_BITS = 256;

export interface IKeyPairSerialized {
  key: string;
  iv: string;
}

export interface IKeyPair {
  key: CryptoKey;
  iv: Uint8Array;
}

export const createNewKeypair = async () => {
  const CRYPTO_KEY = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: AES_KEY_BITS,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const a: IKeyPair = {
    key: CRYPTO_KEY,
    iv: crypto.getRandomValues(new Uint8Array(AES_IV_BYTES)),
  };

  return a;
};

export async function loadKeyPair() {
  const a = await loadJsonFile<IKeyPairSerialized>();

  const PAIR: IKeyPair = {
    iv: base64.toByteArray(a.iv),
    key: await crypto.subtle.importKey(
      "raw",
      base64.toByteArray(a.key),
      {
        name: "AES-GCM",
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
  };

  await writeFile(JSON.stringify(SERIALIZED_KEYPAIR, null, 2), ".json");
}
