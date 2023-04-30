import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import EditorApp from "@/app/Editor";
import PreviewApp from "@/app/Preview";
import bootModels from "@/bootstrap/model";
import bootRenderBlockImage from "@/bootstrap/renderBlockImage";
import bootCommand from "@/bootstrap/command";
import bootExcalidrawLibraryItems from "@/bootstrap/excalidrawLibraryItems";
import rewriteAllFont from "@/lib/rewriteFont";
import { getSettingsSchema } from "@/lib/utils";

import "./index.css";

console.log("=== logseq-plugin-excalidraw loaded ===");
logseq.ready(() => {
  logseq.on("ui:visible:changed", (e) => {
    if (!e.visible) {
      ReactDOM.unmountComponentAtNode(
        document.getElementById("root") as Element
      );
    }
  });

  bootModels(renderApp);

  // toolbar item
  // logseq.App.registerUIItem("toolbar", {
  //   key: "logseq-plugin-excalidraw",
  //   template:
  //     '<a data-on-click="show" class="button"><i class="ti ti-window"></i></a>',
  // });

  // render excalidraw block svg
  bootRenderBlockImage();

  // initialize excalidraw library items
  bootExcalidrawLibraryItems();

  bootCommand();

  const settingsSchema = getSettingsSchema();
  logseq.useSettingsSchema(settingsSchema);

  rewriteAllFont();
});

export type Mode = "edit" | "preview";
export type RenderAppProps = {
  mode: Mode;
  pageName: string;
  renderSlotId?: string;
};
function renderApp({ mode, pageName, renderSlotId }: RenderAppProps) {
  const AppMaps: Record<Mode, React.ReactElement> = {
    preview: <PreviewApp pageName={pageName} />,
    edit: <EditorApp pageName={pageName} renderSlotId={renderSlotId} />,
  };
  ReactDOM.render(
    <React.StrictMode>{AppMaps[mode]}</React.StrictMode>,
    document.getElementById("root")
  );
}
