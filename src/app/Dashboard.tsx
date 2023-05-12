import { Toaster } from "@/components/ui/toaster";
import { X, MoreHorizontal, Trash2, Edit3, Tag, Image } from "lucide-react";
import Editor, { EditorTypeEnum, Theme } from "@/components/Editor";
import {
  getExcalidrawInfoFromPage,
  getExcalidrawPages,
  getTags,
  setTheme,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { exportToSvg } from "@excalidraw/excalidraw";
import SVGComponent from "@/components/SVGComponent";
import { tagsAtom } from "@/model/tags";
import { Input } from "@/components/ui/input";
import TagSelector from "@/components/TagSelector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PREVIEW_WINDOW = {
  width: 280,
  height: 180,
};
const TITLE_HEIGHT = 50;

const DashboardApp = () => {
  const [allPages, setAllPages] = useState<
    Array<
      PageEntity & {
        drawSvg: SVGSVGElement;
        drawAlias?: string;
        drawTag?: string;
      }
    >
  >([]);
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
            <div
              key={page.id}
              className="flex flex-col border rounded-md overflow-hidden relative cursor-pointer hover:shadow-xl dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-slate-800"
              style={{ height: `${PREVIEW_WINDOW.height + TITLE_HEIGHT}px` }}
              onClick={() => {
                setEditorInfo({
                  show: true,
                  pageName: page.originalName,
                });
              }}
            >
              <div
                className="h-48 overflow-hidden flex justify-center items-center bg-white relative"
                style={{ height: `${PREVIEW_WINDOW.height}px` }}
              >
                {page.drawSvg && <SVGComponent svgElement={page.drawSvg} />}
                <div className="w-full h-full absolute">
                  <div className="bg-slate-400 h-7 flex justify-end items-center w-full px-2 opacity-50">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal size="16" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" /> Set Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Image className="mr-2 h-4 w-4" /> Copy Renderer Text
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <div className="text-rose-500 flex">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div
                className="truncate border-t px-2 flex items-center bg-stone-100 dark:bg-slate-800"
                style={{ height: `${TITLE_HEIGHT}px` }}
              >
                {page.drawAlias || page.name}
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
