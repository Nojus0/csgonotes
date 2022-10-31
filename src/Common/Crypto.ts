import {KeyPair} from "@Common/KeyPair";

export const READ_WRITE: FileSystemHandlePermissionDescriptor = {mode: "readwrite"};
export const READ_ONLY: FileSystemHandlePermissionDescriptor = {mode: "read"};

export async function decryptJsonObject<T>(pair: KeyPair, f: ArrayBuffer) {
    const a: ArrayBuffer = await crypto.subtle.decrypt(
        {name: "AES-GCM", iv: pair.iv},
        pair.key,
        f
    );

    return JSON.parse(new TextDecoder().decode(a)) as T;
}

export async function encryptJsonObject(
    pair: KeyPair,
    obj: object
): Promise<ArrayBuffer> {
    const c: ArrayBuffer = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv: pair.iv},
        pair.key,
        new TextEncoder().encode(JSON.stringify(obj))
    );

    return c;
}
