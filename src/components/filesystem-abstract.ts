// TODO HANDLE CANCELATION !

import { playErrorSound } from "../utils/Sounds";

export async function loadJsonFile<T>(): Promise<T> {
  const options: OpenFilePickerOptions = {
    multiple: false,
    types: [
      {
        description: "Json file",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  };
  try {
    const [handle] = await showOpenFilePicker(options);
    const file = await handle.getFile();
    const text = await file.text();

    return JSON.parse(text) as T;
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

export async function loadFile(ext: ".json" | ".bin"): Promise<ArrayBuffer> {
  const options: OpenFilePickerOptions = {
    multiple: false,
    types: [
      ext == ".json"
        ? {
            description: "Json file",
            accept: {
              "application/json": [".json"],
            },
          }
        : {
            description: "Binary file",
            accept: {
              "application/octet-stream": [".bin"],
            },
          },
    ],
  };
  try {
    const [handle] = await showOpenFilePicker(options);
    const file = await handle.getFile();

    return file.arrayBuffer();
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

export async function writeFile<T>(
  data: FileSystemWriteChunkType,
  ext: ".json" | ".bin"
) {
  const options: OpenFilePickerOptions = {
    multiple: false,
    types: [
      ext == ".json"
        ? {
            description: "Json file",
            accept: {
              "application/json": [".json"],
            },
          }
        : {
            description: "Binary file",
            accept: {
              "application/octet-stream": [".bin"],
            },
          },
    ],
  };
  try {
    const handle = await showSaveFilePicker(options);
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}
