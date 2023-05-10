import { Toaster } from "@/components/ui/toaster";
import Editor from "@/components/Editor";
import { getExcalidrawInfoFromPage } from "@/lib/utils";
import { insertSVG } from "@/bootstrap/renderBlockImage";

const DashboardApp = () => {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center overflow-auto">
        <div
          className="w-screen h-screen fixed top-0 left-0"
          onClick={() => logseq.hideMainUI()}
        ></div>
        <h2>Dashboard</h2>
      </div>
      <Toaster />
    </>
  );
};

export default DashboardApp;
