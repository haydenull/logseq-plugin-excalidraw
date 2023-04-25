import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { debounce } from "lodash";
import { genBlockData, getExcalidrawDataFromPage } from "../util";

const Editor: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const [excalidrawData, setExcalidrawData] = useState<any>();
  const blockUUIDRef = useRef<string>();

  const onExcalidrawChange = debounce((excalidrawElements, appState, files) => {
    const blockData = genBlockData({
      ...excalidrawData,
      elements: excalidrawElements,
      appState,
      files,
    });
    if (blockUUIDRef.current)
      logseq.Editor.updateBlock(blockUUIDRef.current, blockData);
  }, 2000);

  useEffect(() => {
    getExcalidrawDataFromPage(pageName).then((data) => {
      setExcalidrawData(data?.excalidrawData);
      blockUUIDRef.current = data?.block?.uuid;
    });
  }, [pageName]);
  return (
    <div className="w-screen h-screen">
      {excalidrawData && (
        <Excalidraw
          initialData={{
            elements: excalidrawData?.elements || [],
            appState: excalidrawData?.elements?.appState || {},
            scrollToContent: true,
          }}
          onChange={onExcalidrawChange}
        />
      )}
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
