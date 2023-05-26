import "@logseq/libs";
import React from "react";
import { type Root, createRoot } from "react-dom/client";
import EditorApp from "@/app/Editor";
import PreviewApp from "@/app/Preview";
import DashboardApp from "./app/Dashboard";
import bootModels from "@/bootstrap/model";
import bootRenderBlockImage from "@/bootstrap/renderBlockImage";
import bootCommand from "@/bootstrap/command";
import bootExcalidrawLibraryItems from "@/bootstrap/excalidrawLibraryItems";
import rewriteAllFont from "@/lib/rewriteFont";
import { getSettingsSchema } from "@/lib/utils";
import { proxyLogseq } from "@/lib/logseqProxy";

import "./index.css";

const isDevelopment = import.meta.env.DEV;
let reactAppRoot: Root | null = null;

console.log("=== logseq-plugin-excalidraw loaded ===");

if (isDevelopment) {
  // run in browser
  proxyLogseq();

  // @ts-ignore
  renderApp({ mode: "dashboard" });

  // bootModels(renderApp);
  // toolbar item
  // logseq.App.registerUIItem("toolbar", {
  //   key: "logseq-plugin-excalidraw",
  //   template:
  //     '<a data-on-click="showDashboard" class="button"><i class="ti ti-window"></i></a>',
  // });
} else {
  // run in logseq
  logseq.ready(() => {
    logseq.on("ui:visible:changed", (e) => {
      if (!e.visible) {
        // ReactDOM.unmountComponentAtNode(
        //   document.getElementById("root") as Element
        // );
        reactAppRoot?.unmount?.();
      }
    });

    // fix: https://github.com/haydenull/logseq-plugin-excalidraw/issues/6
    logseq.setMainUIInlineStyle({ zIndex: 9999 });

    bootModels(renderApp);

    // toolbar item
    logseq.App.registerUIItem("toolbar", {
      key: "logseq-plugin-excalidraw",
      template:
        '<a data-on-click="showDashboard" class="button"><i class="ti ti-scribble"></i></a>',
    });

    // render excalidraw block svg
    bootRenderBlockImage();

    // initialize excalidraw library items
    bootExcalidrawLibraryItems();

    bootCommand();

    const settingsSchema = getSettingsSchema();
    logseq.useSettingsSchema(settingsSchema);

    rewriteAllFont();
  });
}

export type Mode = "edit" | "preview" | "dashboard";
export type RenderAppProps = {
  mode: Mode;
  pageName: string;
  renderSlotId?: string;
};
function renderApp({ mode, pageName, renderSlotId }: RenderAppProps) {
  const AppMaps: Record<Mode, React.ReactElement> = {
    preview: <PreviewApp pageName={pageName} />,
    edit: <EditorApp pageName={pageName} renderSlotId={renderSlotId} />,
    dashboard: <DashboardApp />,
  };
  // ReactDOM.render(
  //   <React.StrictMode>{AppMaps[mode]}</React.StrictMode>,
  //   document.getElementById("root")
  // );
  const container = document.getElementById("root");
  reactAppRoot = createRoot(container!);
  reactAppRoot.render(<React.StrictMode>{AppMaps[mode]}</React.StrictMode>);
}
