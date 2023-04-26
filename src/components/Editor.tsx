import React, { useEffect, useRef, useState } from "react";
import {
  Excalidraw,
  Button,
  MainMenu,
  WelcomeScreen,
} from "@excalidraw/excalidraw";
import { debounce } from "lodash";
import { TbLogout, TbBrandGithub } from "react-icons/tb";
import {
  genBlockData,
  getExcalidrawInfoFromPage,
  getMinimalAppState,
} from "@/helper/util";
import type { ExcalidrawData } from "@/type";
import type { LibraryItems } from "@excalidraw/excalidraw/types/types";
import {
  getExcalidrawLibraryItems,
  updateExcalidrawLibraryItems,
} from "@/bootstrap/excalidrawLibraryItems";

type Theme = "light" | "dark";

const Editor: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({
  pageName,
}) => {
  const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData>();
  const [libraryItems, setLibraryItems] = useState<LibraryItems>();
  const [theme, setTheme] = useState<Theme>();
  const blockUUIDRef = useRef<string>();

  // save excalidraw data to page
  const onExcalidrawChange = debounce((excalidrawElements, appState, files) => {
    const blockData = genBlockData({
      ...excalidrawData,
      elements: excalidrawElements,
      appState: getMinimalAppState(appState),
      files,
    });
    if (blockUUIDRef.current)
      logseq.Editor.updateBlock(blockUUIDRef.current, blockData);
  }, 1000);
  // save library items to page
  const onLibraryChange = (items: LibraryItems) => {
    updateExcalidrawLibraryItems(items);
  };

  // initialize excalidraw data
  useEffect(() => {
    getExcalidrawInfoFromPage(pageName).then((data) => {
      setExcalidrawData(data?.excalidrawData);
      blockUUIDRef.current = data?.block?.uuid;
    });
  }, [pageName]);
  // initialize library items
  useEffect(() => {
    getExcalidrawLibraryItems().then((items) => {
      setLibraryItems(items || []);
    });
  }, []);
  // initialize theme
  useEffect(() => {
    logseq.App.getStateFromStore<Theme>("ui/theme").then(setTheme);
  }, []);

  return (
    <div className="w-screen h-screen">
      {excalidrawData && libraryItems && (
        <Excalidraw
          initialData={{
            elements: excalidrawData.elements || [],
            appState: excalidrawData.appState
              ? Object.assign(
                  { theme },
                  getMinimalAppState(excalidrawData.appState)
                )
              : { theme },
            files: excalidrawData?.files || undefined,
            libraryItems,
            scrollToContent: true,
          }}
          onChange={onExcalidrawChange}
          onLibraryChange={onLibraryChange}
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
