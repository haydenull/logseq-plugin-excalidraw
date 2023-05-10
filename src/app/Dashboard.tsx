import { Toaster } from "@/components/ui/toaster";
import Editor, { EditorTypeEnum } from "@/components/Editor";
import { getExcalidrawInfoFromPage, getExcalidrawPages } from "@/lib/utils";
import { insertSVG } from "@/bootstrap/renderBlockImage";
import { useEffect, useState } from "react";
import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { exportToSvg, THEME } from "@excalidraw/excalidraw";
import SVGComponent from "@/components/SVGComponent";

const PREVIEW_WINDOW = {
  width: 280,
  height: 180,
};
const TITLE_HEIGHT = 50;

const DashboardApp = () => {
  const [allPages, setAllPages] = useState<
    Array<PageEntity & { svg: SVGSVGElement }>
  >([]);
  console.log("[faiz:] === allPages", allPages);
  const [editorInfo, setEditorInfo] = useState<{
    show: boolean;
    pageName?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    getExcalidrawPages().then(async (pages) => {
      if (!pages) return;
      const promises = pages.map(async (page) => {
        const { excalidrawData } = await getExcalidrawInfoFromPage(page.name);
        const svg = await exportToSvg({
          elements: excalidrawData?.elements ?? [],
          appState: excalidrawData?.appState ?? {},
          exportPadding: 20,
          files: excalidrawData?.files ?? null,
        });
        const width = Number(svg.getAttribute("width")) || 100;
        const height = Number(svg.getAttribute("height")) || 80;
        // display svg in full screen based on aspect radio
        const aspectRadio = width / height;
        const windowAspectRadio = PREVIEW_WINDOW.width / PREVIEW_WINDOW.height;
        if (aspectRadio > windowAspectRadio) {
          svg.style.width = PREVIEW_WINDOW.width + "px";
          svg.style.height = "auto";
        } else {
          svg.style.width = "auto";
          svg.style.height = PREVIEW_WINDOW.height + "px";
        }
        return {
          ...page,
          drawSvg: svg,
        };
      });
      setAllPages(await Promise.all(promises));
    });
  }, []);

  return (
    <>
      <div className="p-4">
        <h2>Dashboard</h2>
        <section
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill,${PREVIEW_WINDOW.width}px)`,
          }}
        >
          {allPages.map((page) => (
            <div
              key={page.id}
              className="flex flex-col border rounded relative cursor-pointer"
              style={{ height: `${PREVIEW_WINDOW.height + TITLE_HEIGHT}px` }}
              onClick={() => {
                setEditorInfo({
                  show: true,
                  pageName: page.originalName,
                });
              }}
            >
              <div
                className="h-48 overflow-hidden flex justify-center items-center"
                style={{ height: `${PREVIEW_WINDOW.height}px` }}
              >
                {page.drawSvg && <SVGComponent svgElement={page.drawSvg} />}
              </div>
              <div
                className="truncate border-t px-2 flex items-center bg-stone-100"
                style={{ height: `${TITLE_HEIGHT}px` }}
              >
                {page.name}
              </div>
            </div>
          ))}
        </section>
        {editorInfo.show && editorInfo.pageName && (
          <div className="fixed top-0 left-0 w-screen h-screen">
            <Editor
              key={editorInfo.pageName}
              pageName={editorInfo.pageName}
              type={EditorTypeEnum.Page}
              onClose={() => setEditorInfo({ show: false })}
            />
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default DashboardApp;
