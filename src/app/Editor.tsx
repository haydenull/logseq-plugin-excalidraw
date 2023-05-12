import { useAtom } from "jotai";
import { Toaster } from "@/components/ui/toaster";
import Editor, { Theme } from "@/components/Editor";
import { getExcalidrawInfoFromPage, getTags, setTheme } from "@/lib/utils";
import { insertSVG } from "@/bootstrap/renderBlockImage";
import { useEffect } from "react";
import { tagsAtom } from "@/model/tags";

const EditorApp: React.FC<{ pageName: string; renderSlotId?: string }> = ({
  pageName,
  renderSlotId,
}) => {
  const [, setTags] = useAtom(tagsAtom);
  const onClose = async () => {
    // refresh render block image
    if (pageName && renderSlotId) {
      const { excalidrawData } = await getExcalidrawInfoFromPage(pageName);
      insertSVG(renderSlotId, undefined, excalidrawData);
    }
  };
  useEffect(() => {
    getTags().then(setTags);
  }, []);
  // initialize theme
  useEffect(() => {
    logseq.App.getStateFromStore<Theme>("ui/theme").then(setTheme);
  }, []);
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center overflow-auto">
        <div
          className="w-screen h-screen fixed top-0 left-0"
          onClick={() => logseq.hideMainUI()}
        ></div>
        <Editor pageName={pageName} onClose={onClose} />
      </div>
      <Toaster />
    </>
  );
};

export default EditorApp;
