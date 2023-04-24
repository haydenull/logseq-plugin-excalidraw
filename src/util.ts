import { PageIdentity } from "@logseq/libs/dist/LSPlugin.user";

/**
 * get excalidraw data
 * ```json\n{xxx}\n``` --> {xxx}
 */
export const getExcalidrawData = (text: string) => {
  const match = text.match(/```json\n(.*)\n```/s);
  return match ? JSON.parse(match[1]) : null;
};

export const getExcalidrawDataFromPage = async (srcPage: PageIdentity) => {
  console.log("[faiz:] === srcPage", srcPage);
  const pageBlocks = await logseq.Editor.getPageBlocksTree(srcPage);
  console.log("[faiz:] === pageBlocks", pageBlocks);
  const codeBlock = pageBlocks?.[2];
  const excalidrawData = getExcalidrawData(codeBlock?.content);
  return excalidrawData;
};

/**
 * 监听 esc 按钮
 */
export const listenEsc = (callback: () => void) => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      callback();
    }
  });
};
