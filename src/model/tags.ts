import { getExcalidrawPages } from "@/lib/utils";
import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { atom } from "jotai";

const getTags = () => {
  getExcalidrawPages().then(async (pages) => {
    if (!pages) return [];
    const promises = pages.map(async (page: PageEntity) => {
      const blocks = await logseq.Editor.getPageBlocksTree(page.originalName);
      return blocks?.[0]?.properties?.excalidrawPluginTag;
    });
    const tags = await Promise.all(promises);
    return tags?.filter(Boolean);
  });
  return [];
};
export const tagsAtom = atom<string[]>(getTags());
