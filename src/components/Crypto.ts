import { IKeyPair } from "./KeyPair";

export async function decryptJsonFile<T>(k: IKeyPair, f: ArrayBuffer) {
  const a: ArrayBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: k.iv },
    k.key,
    f
  );

  return JSON.parse(new TextDecoder().decode(a)) as T;
}

export async function encryptJsonFile(
  k: IKeyPair,
  f: string
): Promise<ArrayBuffer> {
  const c: ArrayBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: k.iv },
    k.key,
    new TextEncoder().encode(f)
  );

  return c;
}
