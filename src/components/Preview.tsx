import React, { useEffect, useRef } from "react";
import { getExcalidrawInfoFromPage } from "../helper/util";
import { exportToSvg } from "@excalidraw/excalidraw";

const Preview: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageName) {
      getExcalidrawInfoFromPage(pageName).then(async ({ excalidrawData }) => {
        const svg = await exportToSvg({
          elements: excalidrawData?.elements ?? [],
          appState: excalidrawData?.appState ?? {},
          files: null,
        });
        if (containerRef?.current) {
          containerRef.current.appendChild(svg);
        }
      });
    }
  }, [pageName]);

  return <div ref={containerRef}></div>;
};

export default Preview;
