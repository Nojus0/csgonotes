import { DEBUG_ALL_LOADED } from "./debug";
import { endings, mime, writeFile } from "./Filesystem";
import { ILoaded } from "./utils";
import bs58 from "bs58";

export const AES_IV_BYTES = 32;
export const AES_KEY_BITS = AES_IV_BYTES * 8;
export const VERSION = 1;

export interface KeyPairSerialized {
  key: string;
  iv: string;
  version: number;
}

export interface KeyPair {
  key: CryptoKey;
  iv: Uint8Array;
}

export type KeyPairStore = DetailedKeypair &
  ILoaded & { handle: FileSystemFileHandle };

export interface DetailedKeypair extends KeyPair {
  version: number;
}

export const defaultKeyPairStore = () =>
  ({
    loaded: DEBUG_ALL_LOADED,
    version: VERSION,
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

  const a: DetailedKeypair = {
    key: CRYPTO_KEY,
    version: VERSION,
    iv: crypto.getRandomValues(new Uint8Array(AES_IV_BYTES)),
  };

  return a;
};

export async function serializeKeyPair(keypair: DetailedKeypair) {
  const KEY_BUF = new Uint8Array(
    await crypto.subtle.exportKey("raw", keypair.key)
  );

  const SERIALIZED_KEYPAIR: KeyPairSerialized = {
    key: bs58.encode(KEY_BUF),
    iv: bs58.encode(keypair.iv),
    version: keypair.version,
  };

  return SERIALIZED_KEYPAIR;
}

export async function exportKeyPair(keypair: DetailedKeypair) {
  const s = await serializeKeyPair(keypair);
  return await writeFile(
    JSON.stringify(s, null, 2),
    mime.json,
    endings.json,
    getKeypairName(),
    "keypair"
  );
}

export async function deserializeKeyPair(
  serializedKeypair: KeyPairSerialized
): Promise<DetailedKeypair> {
  const importedCryptoKey = await crypto.subtle.importKey(
    "raw",
    bs58.decode(serializedKeypair.key),
    {
      name: "AES-GCM",
      hash: "SHA-512",
      length: AES_KEY_BITS,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return {
    key: importedCryptoKey,
    iv: bs58.decode(serializedKeypair.iv),
    version: serializedKeypair.version,
  };
}

export function decodeSerializedKeypairBuffer(
  keypairBuffer: ArrayBuffer
): KeyPairSerialized {
  const serializedKeypair: KeyPairSerialized = JSON.parse(
    new TextDecoder().decode(keypairBuffer)
  );
  return serializedKeypair;
}

export function getKeypairName() {
  const a = crypto.getRandomValues(new Uint8Array(4));

  const id = bs58.encode(a);
  const date = new Date();
  const name = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-Key-${id}.json`;
  return name;
}
