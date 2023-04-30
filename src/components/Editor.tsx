import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Excalidraw,
  Button,
  MainMenu,
  WelcomeScreen,
} from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { debounce } from "lodash";
import { TbLogout, TbBrandGithub } from "react-icons/tb";
import {
  genBlockData,
  getExcalidrawInfoFromPage,
  getLangCode,
  getMinimalAppState,
} from "@/lib/utils";
import type { ExcalidrawData, PluginSettings } from "@/type";
import type { LibraryItems } from "@excalidraw/excalidraw/types/types";
import {
  getExcalidrawLibraryItems,
  updateExcalidrawLibraryItems,
} from "@/bootstrap/excalidrawLibraryItems";
import getI18N from "@/locales";

type Theme = "light" | "dark";
const WAIT = 300;

const Editor: React.FC<
  React.PropsWithChildren<{ pageName: string; onClose?: () => void }>
> = ({ pageName, onClose }) => {
  const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData>();
  const [libraryItems, setLibraryItems] = useState<LibraryItems>();
  const [theme, setTheme] = useState<Theme>();
  const blockUUIDRef = useRef<string>();
  const currentExcalidrawDataRef = useRef<ExcalidrawData>();

  const { toast } = useToast();
  const { editor: i18nEditor } = getI18N();

  // save excalidraw data to currentExcalidrawDataRef
  const onExcalidrawChange = debounce(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles
    ) => {
      // const blockData = genBlockData({
      //   ...excalidrawData,
      //   elements: excalidrawElements,
      //   appState: getMinimalAppState(appState),
      //   files,
      // });
      // if (blockUUIDRef.current)
      //   logseq.Editor.updateBlock(blockUUIDRef.current, blockData);
      currentExcalidrawDataRef.current = {
        elements,
        appState,
        files,
      };
    },
    WAIT
  );
  // save library items to page
  const onLibraryChange = (items: LibraryItems) => {
    updateExcalidrawLibraryItems(items);
  };
  // save excalidraw data to page
  const onClickClose = () => {
    const { id, dismiss } = toast({
      variant: "destructive",
      title: i18nEditor.saveToast.title,
      description: i18nEditor.saveToast.description,
      duration: 0,
    });
    setTimeout(async () => {
      if (currentExcalidrawDataRef.current && blockUUIDRef.current) {
        console.log("[faiz:] === start save");
        const { elements, appState, files } = currentExcalidrawDataRef.current;
        const blockData = genBlockData({
          ...excalidrawData,
          elements,
          appState: getMinimalAppState(appState!),
          files,
        });
        await logseq.Editor.updateBlock(blockUUIDRef.current, blockData);
        console.log("[faiz:] === end save");
        dismiss();
        onClose?.();
        logseq.hideMainUI();
      }
    }, WAIT + 100);
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
          langCode={getLangCode(
            (logseq.settings as unknown as PluginSettings)?.langCode
          )}
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
              onSelect={onClickClose}
              style={{ width: "38px", height: "38px", color: "#666" }}
              title={i18nEditor.exitButton}
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
