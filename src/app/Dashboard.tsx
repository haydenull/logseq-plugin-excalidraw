import { Toaster } from "@/components/ui/toaster";
import { X } from "lucide-react";
import Editor, { EditorTypeEnum, Theme } from "@/components/Editor";
import {
  getExcalidrawInfoFromPage,
  getExcalidrawPages,
  getTags,
  setTheme,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { exportToSvg } from "@excalidraw/excalidraw";
import { tagsAtom } from "@/model/tags";
import { Input } from "@/components/ui/input";
import TagSelector from "@/components/TagSelector";
import { Button } from "@/components/ui/button";
import DrawingCard, {
  PREVIEW_WINDOW,
  type IPageWithDrawing,
} from "@/components/DrawingCard";

const DashboardApp = () => {
  const [allPages, setAllPages] = useState<IPageWithDrawing[]>([]);
  console.log("[faiz:] === allPages", allPages);
  const [editorInfo, setEditorInfo] = useState<{
    show: boolean;
    pageName?: string;
  }>({
    show: false,
  });
  const [, setTags] = useAtom(tagsAtom);
  const [filterTag, setFilterTag] = useState<string>();
  const [filterInput, setFilterInput] = useState<string>("");

  const pagesAfterFilter = allPages.filter((page) => {
    const _filterInput = filterInput?.trim();
    const _filterTag = filterTag?.trim();

    // show all drawings if no filter
    const hasFilterTag = _filterTag
      ? page.drawTag?.toLowerCase().includes(_filterTag)
      : true;
    const hasFilterInput = _filterInput
      ? page.drawAlias?.toLowerCase().includes(_filterInput)
      : true;
    return hasFilterTag && hasFilterInput;
  });

  const onClickReset = () => {
    setFilterInput("");
    setFilterTag("");
  };
  const onClickDrawing = (page: IPageWithDrawing) => {
    setEditorInfo({
      show: true,
      pageName: page.originalName,
    });
  };

  useEffect(() => {
    getExcalidrawPages().then(async (pages) => {
      if (!pages) return;
      const promises = pages.map(async (page) => {
        const { excalidrawData, rawBlocks } = await getExcalidrawInfoFromPage(
          page.name
        );
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

        const firstBlock = rawBlocks?.[0];
        const drawAlias = firstBlock?.properties?.excalidrawPluginAlias;
        const drawTag = firstBlock?.properties?.excalidrawPluginTag;
        return {
          ...page,
          drawSvg: svg,
          drawAlias,
          drawTag,
        };
      });
      setAllPages(await Promise.all(promises));
    });
  }, []);
  useEffect(() => {
    getTags().then(setTags);
  }, []);
  // initialize theme
  useEffect(() => {
    logseq.App.getStateFromStore<Theme>("ui/theme").then(setTheme);
  }, []);

  return (
    <>
      <div className="py-5 px-10">
        <div className="flex justify-center my-8">
          <div className="flex gap-2 max-w-2xl flex-1 justify-between">
            <Input
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder="Filter drawings..."
            />
            <TagSelector asFilter value={filterTag} onChange={setFilterTag} />
            {Boolean(filterTag) || Boolean(filterInput) ? (
              <Button variant="ghost" onClick={onClickReset}>
                Reset <X size="16" className="ml-2" />
              </Button>
            ) : null}
            {/* <Button>Create</Button> */}
          </div>
        </div>
        <section
          className="grid gap-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(auto-fill,${PREVIEW_WINDOW.width}px)`,
          }}
        >
          {pagesAfterFilter.map((page) => (
            <DrawingCard page={page} onClickDrawing={onClickDrawing} />
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
