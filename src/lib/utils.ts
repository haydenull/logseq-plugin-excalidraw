import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { pick } from "lodash";
import type { ExcalidrawData } from "@/type";
import type {
  BlockEntity,
  PageIdentity,
} from "@logseq/libs/dist/LSPlugin.user";
import {
  APP_STATE_PROPERTIES,
  DEFAULT_EXCALIDRAW_DATA,
} from "../lib/constants";
import type {
  AppState,
  LibraryItems,
} from "@excalidraw/excalidraw/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * get excalidraw data
 * ```json\n{xxx}\n``` --> {xxx}
 */
export const getExcalidrawData = (
  text?: string
): ExcalidrawData | LibraryItems | null => {
  const match = text?.match(/```json\n(.*)\n```/s);
  return match ? JSON.parse(match[1]) : null;
};
/**
 * gen block data
 * {xxx} --> ```json\n{xxx}\n```
 */
export const genBlockData = (
  excalidrawData: Record<string, unknown> | LibraryItems
) => {
  return `\`\`\`json\n${JSON.stringify(excalidrawData)}\n\`\`\``;
};

export const getExcalidrawInfoFromPage = async (
  srcPage: PageIdentity
): Promise<{
  excalidrawData: ExcalidrawData;
  block: BlockEntity;
}> => {
  console.log("[faiz:] === srcPage", srcPage);
  const pageBlocks = await logseq.Editor.getPageBlocksTree(srcPage);
  console.log("[faiz:] === pageBlocks", pageBlocks);
  const codeBlock = pageBlocks?.[3];
  const excalidrawData = getExcalidrawData(
    codeBlock?.content
  ) as ExcalidrawData;
  return {
    excalidrawData: excalidrawData || DEFAULT_EXCALIDRAW_DATA,
    block: codeBlock,
  };
};

/**
 * listen esc keyup event
 */
export const listenEsc = (callback: () => void) => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      callback();
    }
  });
};

export const createSVGElement = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  return svgDoc.documentElement;
};

/**
 * Extract some properties from appState
 */
export const getMinimalAppState = (appState: AppState) => {
  return pick(appState, APP_STATE_PROPERTIES);
};
