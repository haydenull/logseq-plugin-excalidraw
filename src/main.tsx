import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import { exportToSvg } from "@excalidraw/excalidraw";
import dayjs from "dayjs";
import App, { type Mode } from "./App";
import "./index.css";
import { getExcalidrawData, listenEsc } from "./util";

const DEMO_FILE_ORIGINAL_NAME = "excalidraw-2023-04-24-16-39-01";

console.log("=== logseq-plugin-excalidraw loaded ===");
logseq.ready(() => {
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
  });

  logseq.App.registerUIItem("toolbar", {
    key: "logseq-plugin-excalidraw",
    template:
      '<a data-on-click="show" class="button"><i class="ti ti-window"></i></a>',
  });

  // command palette: create excalidraw
  logseq.App.registerCommandPalette(
    {
      key: "logseq-plugin-excalidraw:create",
      label: "create excalidraw",
    },
    async (data) => {
      const fileName = dayjs().format("excalidraw-YYYY-MM-DD-HH-mm-ss");
      const file = await logseq.Editor.createPage(
        fileName,
        {
          excalidraw: true,
        },
        { format: "markdown" }
      );
    }
  );
  // render: {{renderer excalidraw, excalidraw-2021-08-31-16-00-00}}
  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { arguments: args, pageName } }) => {
      if (args?.[0] !== "excalidraw") return;
      const fileName = args?.[1];

      const rendered = parent.document.getElementById(slot)?.childElementCount;
      if (rendered) return;

      const page = await logseq.Editor.getPage(DEMO_FILE_ORIGINAL_NAME);
      console.log("[faiz:] === page", page);
      const pageBlocks = await logseq.Editor.getPageBlocksTree(
        DEMO_FILE_ORIGINAL_NAME
      );
      console.log("[faiz:] === pageBlocks", pageBlocks);
      if (page?.properties?.excalidraw) {
      }

      // ```json\n{xxx}\n```
      const codeBlock = pageBlocks?.[2];
      // get excalidraw data
      const excalidrawData = getExcalidrawData(codeBlock?.content);
      console.log("[faiz:] === excalidrawData", excalidrawData);

      const svg = await exportToSvg({
        elements: excalidrawData?.elements ?? [],
        appState: excalidrawData?.appState ?? {},
        files: null,
      });

      const id = `excalidraw-${fileName}-${slot}`;
      logseq.provideUI({
        key: `excalidraw-${slot}`,
        slot,
        reset: true,
        template: `<div id="${id}" class="excalidraw-container">
            <div class="excalidraw-toolbar">
              <a data-on-click="edit" data-page-name="${page?.originalName}">
                <i class="ti ti-edit"></i>
              </a>
              <a data-on-click="fullscreen" data-page-name="${page?.originalName}">
                <i class="ti ti-maximize"></i>
              </a>
            </div>
          </div>`,
      });
      setTimeout(() => {
        // insert preview img
        svg.style.width = "100%";
        svg.style.height = "200px";
        parent.document.getElementById(id)?.prepend(svg);
      }, 0);
    }
  );

  logseq.provideStyle(`
  .excalidraw-container {
    position: relative;
  }
  .excalidraw-toolbar {
    display: flex;
    gap: 10px;
    position: absolute;
    top: 6px;
    right: 6px;
  }
  .excalidraw-toolbar a {
    width: 18px;
    height: 18px;
  }
  `);
  listenEsc(() => logseq.hideMainUI());
});

function renderApp({ mode, pageName }: { mode: Mode; pageName: string }) {
  ReactDOM.render(
    <React.StrictMode>
      <App mode={mode} pageName={pageName} />
    </React.StrictMode>,
    document.getElementById("root")
  );
}
