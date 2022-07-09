import { playErrorSound } from "./audio/AudioSource";
import { READ_ONLY, READ_WRITE } from "./Crypto";

export type FileExt = ".json" | ".bin";

export const mime = {
  json: "application/json",
  bin: "application/octet-stream",
};

export const endings = {
  json: [".json"],
  bin: [".bin"],
};

export async function loadFile(
  mime: string,
  endings: string[],
  id: string
): Promise<[ArrayBuffer, FileSystemFileHandle]> {
  const options = {
    multiple: false,
    id,
    types: [
      {
        accept: {
          [mime]: endings,
        },
      },
    ],
  } as OpenFilePickerOptions;

  try {
    if ("showOpenFilePicker" in window) {
      const [handle] = await showOpenFilePicker(options);
      const file = await handle.getFile();
      return [await file.arrayBuffer(), handle];
    } else {
      return [await openBlob(endings), null];
    }
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

export async function writeFile<T>(
  data: ArrayBuffer | string,
  mime: string,
  endings: string[],
  suggestedName: string,
  id: string
): Promise<FileSystemFileHandle | null> {
  const options = {
    suggestedName,
    id,
    types: [
      {
        accept: {
          [mime]: endings,
        },
      },
    ],
  } as SaveFilePickerOptions;

  try {
    if ("showSaveFilePicker" in window) {
      const handle = await showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
      return handle;
    } else {
      downloadBlob(new Blob([data]), suggestedName);
      return null;
    }
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

async function openBlob(endings: string[]) {
  const a = document.createElement("input");
  a.type = "file";
  a.accept = endings.join(",");
  a.style.display = "none";
  a.click();

  const file = await new Promise<File>((resolve, reject) => {
    a.onchange = () => {
      if (a.files.length == 0) {
        reject("No file selected");
      } else {
        resolve(a.files[0]);
      }
    };
  });

  return await file.arrayBuffer();
}

function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.style.display = "none";
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

type QueryPermissionResult = "ALLOWED_PROMPT" | "DENIED" | "ALLOWED_NO_PROMPT";

export async function queryPermission(
  handle: FileSystemFileHandle,
  mode: "read" | "readwrite"
): Promise<QueryPermissionResult> {
  const MODE = mode == "read" ? READ_ONLY : READ_WRITE;

  const PERM = await handle.queryPermission(MODE);

  if (PERM == "prompt") {
    const RESPONSE = await handle.requestPermission(MODE);
    return RESPONSE == "granted" ? "ALLOWED_PROMPT" : "DENIED";
  } else if (PERM == "granted") {
    return "ALLOWED_NO_PROMPT";
  } else {
    return "DENIED";
  }
}
