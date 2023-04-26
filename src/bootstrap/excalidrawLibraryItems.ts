import {
  DEFAULT_EXCALIDRAW_LIBRARY_ITEMS,
  EXCALIDRAW_FILE_PROMPT,
} from "@/helper/constants";
import { genBlockData, getExcalidrawData } from "@/helper/util";
import { LibraryItems } from "@excalidraw/excalidraw/types/types";

const PAGE_NAME = "excalidraw-library-items-storage";
/**
 * initialize the page sorted in the excalidraw library items
 */
const bootExcalidrawLibraryItems = async () => {
  const page = await logseq.Editor.getPage(PAGE_NAME);
  if (page) return;

  await logseq.Editor.createPage(
    PAGE_NAME,
    { "excalidraw-plugin-library": "true" },
    { format: "markdown", redirect: false }
  );
  await logseq.Editor.appendBlockInPage(PAGE_NAME, EXCALIDRAW_FILE_PROMPT);
  await logseq.Editor.appendBlockInPage(
    PAGE_NAME,
    genBlockData(DEFAULT_EXCALIDRAW_LIBRARY_ITEMS)
  );
};

export const getExcalidrawLibraryItems = async () => {
  const pageBlocks = await logseq.Editor.getPageBlocksTree(PAGE_NAME);
  const codeBlock = pageBlocks?.[2];
  const libraryItems = getExcalidrawData(codeBlock?.content) as LibraryItems;
  return libraryItems;
};

export const updateExcalidrawLibraryItems = async (items: LibraryItems) => {
  const pageBlocks = await logseq.Editor.getPageBlocksTree(PAGE_NAME);
  const codeBlock = pageBlocks?.[2];
  return logseq.Editor.updateBlock(codeBlock.uuid, genBlockData(items));
};

export default bootExcalidrawLibraryItems;
