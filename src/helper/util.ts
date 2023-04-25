import { ExcalidrawData } from "@/type";
import { BlockEntity, PageIdentity } from "@logseq/libs/dist/LSPlugin.user";
import { DEFAULT_EXCALIDRAW_DATA } from "./constants";

/**
 * get excalidraw data
 * ```json\n{xxx}\n``` --> {xxx}
 */
export const getExcalidrawData = (text?: string): ExcalidrawData | null => {
  const match = text?.match(/```json\n(.*)\n```/s);
  return match ? JSON.parse(match[1]) : null;
};
/**
 * gen block data
 * {xxx} --> ```json\n{xxx}\n```
 */
export const genBlockData = (excalidrawData: Record<string, unknown>) => {
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
  const excalidrawData = getExcalidrawData(codeBlock?.content);
  return {
    excalidrawData: excalidrawData || DEFAULT_EXCALIDRAW_DATA,
    block: codeBlock,
  };
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

export const createSVGElement = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  return svgDoc.documentElement;
};
