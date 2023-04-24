import React, { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { getExcalidrawDataFromPage } from "../util";

const Editor: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const [excalidrawData, setExcalidrawData] = useState<any>();
  console.log("[faiz:] === excalidrawData", excalidrawData);
  useEffect(() => {
    getExcalidrawDataFromPage(pageName).then(setExcalidrawData);
  }, [pageName]);
  return (
    <div className="w-screen h-screen">
      <Excalidraw
        initialData={{
          // elements: excalidrawData?.elements,
          appState: excalidrawData?.appState,
          scrollToContent: true,
        }}
      />
      {/* <Excalidraw
        initialData={{
          appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
          scrollToContent: true,
        }}
      /> */}
    </div>
  );
};

export default Editor;
