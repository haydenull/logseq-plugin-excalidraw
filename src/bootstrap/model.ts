import { getExcalidrawInfoFromPage } from "@/lib/utils";
import { RenderAppProps } from "@/main";
import { insertSVG } from "./renderBlockImage";

const bootModels = (renderApp: (props: RenderAppProps) => void) => {
  logseq.provideModel({
    edit(e) {
      const pageName = e.dataset.pageName;
      if (!pageName) return logseq.UI.showMsg("pageName is required");
      renderApp({ mode: "edit", pageName });
      logseq.showMainUI();
    },
    fullscreen(e) {
      const pageName = e.dataset.pageName;
      if (!pageName) return logseq.UI.showMsg("pageName is required");
      renderApp({ mode: "preview", pageName });
      logseq.showMainUI();
    },
    async refresh(e) {
      const pageName = e.dataset.pageName;
      const containerId = e.dataset.containerId;
      if (!pageName) return logseq.UI.showMsg("pageName is required");
      const { excalidrawData } = await getExcalidrawInfoFromPage(pageName);
      insertSVG(containerId, undefined, excalidrawData);
    },
    async delete(e) {
      const pageName = e.dataset.pageName;
      if (!pageName) return logseq.UI.showMsg("pageName is required");
      await logseq.Editor.deletePage(pageName);
      logseq.UI.showMsg("Delete excalidraw file success", "success");
      const uuid = e.dataset.blockId;
      logseq.Editor.removeBlock(uuid);
    },
    async navPage(e) {
      const pageName = e.dataset.pageName;
      if (!pageName) return logseq.UI.showMsg("pageName is required");
      logseq.App.pushState("page", { name: pageName });
    },
  });
};

export default bootModels;
