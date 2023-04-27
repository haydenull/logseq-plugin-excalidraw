import { Toaster } from "@/components/ui/toaster";
import Editor from "@/components/Editor";
import { getExcalidrawInfoFromPage } from "@/lib/utils";
import { insertSVG } from "@/bootstrap/renderBlockImage";

const EditorApp: React.FC<{ pageName: string; renderSlotId?: string }> = ({
  pageName,
  renderSlotId,
}) => {
  const onClose = async () => {
    // refresh render block image
    if (pageName && renderSlotId) {
      const { excalidrawData } = await getExcalidrawInfoFromPage(pageName);
      insertSVG(renderSlotId, undefined, excalidrawData);
    }
  };
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
