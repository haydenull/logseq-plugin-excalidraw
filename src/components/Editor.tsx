import React, { useEffect, useRef, useState } from "react";
import {
  Excalidraw,
  Button,
  MainMenu,
  WelcomeScreen,
} from "@excalidraw/excalidraw";
import { debounce } from "lodash";
import { TbLogout, TbBrandGithub } from "react-icons/tb";
import { genBlockData, getExcalidrawInfoFromPage } from "../helper/util";
import { ExcalidrawData } from "@/type";

const Editor: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData>();
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
  }, 1000);

  useEffect(() => {
    getExcalidrawInfoFromPage(pageName).then((data) => {
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
            appState: excalidrawData?.appState || {},
            files: excalidrawData?.files || undefined,
            scrollToContent: true,
          }}
          onChange={onExcalidrawChange}
          renderTopRightUI={() => (
            <Button
              onSelect={() => logseq.hideMainUI()}
              style={{ width: "38px", height: "38px", color: "#666" }}
              title="Exit"
            >
              <TbLogout />
            </Button>
          )}
        >
          <MainMenu>
            <MainMenu.Item
              icon={<TbBrandGithub />}
              onSelect={() =>
                logseq.App.openExternalLink(
                  "https://github.com/haydenull/logseq-plugin-excalidraw"
                )
              }
            >
              Github
            </MainMenu.Item>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Logo></WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                Logseq Excalidraw Plugin
              </WelcomeScreen.Center.Heading>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      )}
    </div>
  );
};

export default Editor;
