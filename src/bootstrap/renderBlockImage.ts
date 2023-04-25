import { NEW_FILE_EXCALIDRAW_DATA } from "@/helper/constants";
import { getExcalidrawInfoFromPage } from "@/helper/util";
import { ExcalidrawData } from "@/type";
import { exportToSvg } from "@excalidraw/excalidraw";

// const DEMO_FILE_ORIGINAL_NAME = "excalidraw-2023-04-24-16-39-01";

export const insertSVG = async (
  containerId: string,
  svg?: SVGSVGElement,
  excalidrawData?: ExcalidrawData
) => {
  const _svg =
    svg ??
    (await exportToSvg(
      excalidrawData ?? { elements: [], appState: {}, files: null }
    ));
  setTimeout(() => {
    // remove svg if it exists
    const prevSvg = parent.document
      .getElementById(containerId)
      ?.querySelector(".excalidraw-svg");
    if (prevSvg) prevSvg.remove();

    // insert preview img
    _svg.style.maxWidth = "100%";
    _svg.style.minWidth = "100px";
    _svg.style.height = "auto";
    _svg.classList.add("excalidraw-svg");
    parent.document.getElementById(containerId)?.prepend(_svg);
  }, 0);
};

const bootRenderBlockImage = () => {
  // render: {{renderer excalidraw, excalidraw-2021-08-31-16-00-00}}
  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { arguments: args, uuid } }) => {
      const slotType = args?.[0];
      if (slotType === "excalidraw") {
        const pageName = args?.[1];
        console.log("[faiz:] === render pageName", pageName);

        const rendered =
          parent.document.getElementById(slot)?.childElementCount;
        if (rendered) return;

        const page = await logseq.Editor.getPage(pageName);
        if (page === null) {
          return logseq.provideUI({
            key: `excalidraw-${slot}`,
            slot,
            reset: true,
            template: `🚨 Excalidraw: Page Not Found (${pageName})`,
          });
        }
        if (!page?.properties?.excalidrawPlugin) {
          return logseq.provideUI({
            key: `excalidraw-${slot}`,
            slot,
            reset: true,
            template: `🚨 Excalidraw: This page is not an excalidraw file (${pageName})`,
          });
        }

        // get excalidraw data
        const { excalidrawData } = await getExcalidrawInfoFromPage(pageName);
        console.log("[faiz:] === excalidrawData", excalidrawData);

        const { elements, appState } = excalidrawData;
        const id = `excalidraw-${pageName}-${slot}`;

        const isNewFile = elements?.length === 0 && appState === undefined;

        const svg = await exportToSvg(
          isNewFile
            ? NEW_FILE_EXCALIDRAW_DATA
            : {
                elements: elements,
                appState: appState,
                files: null,
              }
        );

        logseq.provideUI({
          key: `excalidraw-${slot}`,
          slot,
          reset: true,
          template: `<div id="${id}" class="excalidraw-container">
            <div class="excalidraw-toolbar">
              <a data-on-click="delete" data-page-name="${page?.originalName}" data-block-id="${uuid}">
                <i class="ti ti-trash"></i>
              </a>
              <a data-on-click="refresh" data-page-name="${page?.originalName}" data-container-id="${id}">
                <i class="ti ti-refresh"></i>
              </a>
              <a data-on-click="edit" data-page-name="${page?.originalName}">
                <i class="ti ti-edit"></i>
              </a>
              <a data-on-click="fullscreen" data-page-name="${page?.originalName}">
                <i class="ti ti-maximize"></i>
              </a>
            </div>
          </div>`,
        });

        insertSVG(id, svg);
      } else if (slotType === "excalidraw-menu") {
        logseq.provideUI({
          key: `excalidraw-${slot}`,
          slot,
          reset: true,
          template: `WIP`,
        });
      }
    }
  );

  logseq.provideStyle(`
  .excalidraw-container {
    position: relative;
    line-height: 0;
  }
  .excalidraw-container:hover .excalidraw-toolbar {
    visibility: visible;
  }
  .excalidraw-toolbar {
    display: flex;
    justify-content: flex-end;
    visibility: hidden;
    transition: visibility 0.2s ease-in-out;
    gap: 10px;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    padding: 6px 4px;
    background: rgba(0, 0, 0, 0.5);
  }
  .excalidraw-toolbar a {
    width: 18px;
    height: 18px;
    line-height: 0;
  }
  `);
};

export default bootRenderBlockImage;