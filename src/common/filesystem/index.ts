import { playErrorSound } from "../audio/error";

export type FileExt = ".json" | ".bin";

export async function loadJsonFile<T>(): Promise<T> {
  const [a] = await loadFile(".json");

  return JSON.parse(new TextDecoder().decode(a)) as T;
}

export async function loadFile(
  ext: FileExt
): Promise<[ArrayBuffer, FileSystemFileHandle]> {
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
    if ("showOpenFilePicker" in window) {
      const [handle] = await showOpenFilePicker(options);
      const file = await handle.getFile();
      return [await file.arrayBuffer(), handle];
    } else {
      return [await openBlob(ext), null];
    }
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

export async function writeFile<T>(
  data: ArrayBuffer | string,
  name: string,
  ext: FileExt
) {
  const options: SaveFilePickerOptions = {
    suggestedName: name,
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
    if ("showSaveFilePicker" in window) {
      const handle = await showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
    } else {
      downloadBlob(new Blob([data]), name);
    }
  } catch (err) {
    playErrorSound();
    throw new Error("User cancelled");
  }
}

async function openBlob(ext: FileExt) {
  const a = document.createElement("input");
  a.type = "file";
  a.accept = ext == ".json" ? "application/json" : "application/octet-stream";
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
