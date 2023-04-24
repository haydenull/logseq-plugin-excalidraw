import React, { ReactElement, useEffect, useRef, useState } from "react";
import { getExcalidrawDataFromPage } from "../util";
import { exportToSvg } from "@excalidraw/excalidraw";

const Preview: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageName) {
      getExcalidrawDataFromPage(pageName).then(async (excalidrawData) => {
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
