import { type AppState } from "@excalidraw/excalidraw/types/types";
import { type ExcalidrawData } from "@/type";

export const FONT_ID = {
  "Hand-drawn": "Virgil",
  Normal: "Cascadia",
  Code: "Assistant",
} as const;

export const DEFAULT_EXCALIDRAW_DATA: ExcalidrawData = {
  elements: [],
  files: null,
};
export const DEFAULT_EXCALIDRAW_LIBRARY_ITEMS = [];

/**
 * Prompt: do not manually edit this file
 */
export const EXCALIDRAW_FILE_PROMPT = `#+BEGIN_IMPORTANT
This file is used to store excalidraw information, Please do not manually edit this file.
#+END_IMPORTANT`;

/**
 * The Excalidraw data when creating a new file (before user draw anything)
 */
export const NEW_FILE_EXCALIDRAW_DATA: ExcalidrawData = {
  elements: [
    {
      type: "text",
      version: 70,
      versionNonce: 1337451650,
      isDeleted: false,
      id: "3ANbtSkpsVqoYMSNbrH93",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      angle: 0,
      x: 677.9921875,
      y: 362.51171875,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      width: 112.1279296875,
      height: 20,
      seed: 314248926,
      groupIds: [],
      roundness: null,
      boundElements: [],
      updated: 1682417141458,
      link: null,
      locked: false,
      fontSize: 16,
      fontFamily: 1,
      text: "Start Drawing",
      textAlign: "left",
      verticalAlign: "top",
      containerId: null,
      originalText: "Start Drawing",
      // @ts-ignore copy from excalidraw demo
      lineHeight: 1.25,
      baseline: 14,
    },
  ],
  files: null,
};

/**
 * The appState properties that need to be stored
 */
export const APP_STATE_PROPERTIES: Array<keyof AppState> = [
  "gridSize",
  "viewBackgroundColor",
];
