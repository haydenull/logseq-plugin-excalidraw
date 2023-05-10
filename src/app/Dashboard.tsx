import { Toaster } from "@/components/ui/toaster";
import Editor from "@/components/Editor";
import { getExcalidrawInfoFromPage, getExcalidrawPages } from "@/lib/utils";
import { insertSVG } from "@/bootstrap/renderBlockImage";
import { useEffect, useState } from "react";
import { PageEntity } from "@logseq/libs/dist/LSPlugin.user";

const DashboardApp = () => {
  const [allPages, setAllPages] = useState<PageEntity[]>([]);

  useEffect(() => {
    getExcalidrawPages().then((pages) => pages && setAllPages(pages));
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center overflow-auto">
        <div
          className="w-screen h-screen fixed top-0 left-0"
          onClick={() => logseq.hideMainUI()}
        ></div>
        <div>
          <h2>Dashboard</h2>
          <ul>
            {allPages.map((page) => (
              <li key={page.id}>{page.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default DashboardApp;
