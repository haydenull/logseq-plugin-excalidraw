import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";

export type ExcalidrawData = {
  elements: ExcalidrawElement[];
  appState?: AppState;
  files: null | BinaryFiles;
};
