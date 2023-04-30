import {
  DEFAULT_EXCALIDRAW_DATA,
  EXCALIDRAW_FILE_PROMPT,
} from "@/lib/constants";
import { genBlockData } from "@/lib/utils";
import getI18N from "@/locales";
import dayjs from "dayjs";

const bootCommand = () => {
  const { createDrawing: i18nCreateDrawing } = getI18N();
  // slash command: create excalidraw
  logseq.Editor.registerSlashCommand(
    i18nCreateDrawing.tag,
    async ({ uuid }) => {
      const fileName = "excalidraw-" + dayjs().format("YYYY-MM-DD-HH-mm-ss");
      try {
        const page = await logseq.Editor.createPage(
          fileName,
          { "excalidraw-plugin": "true" },
          { format: "markdown", redirect: false }
        );
        await logseq.Editor.appendBlockInPage(
          page!.originalName,
          EXCALIDRAW_FILE_PROMPT
        );
        await logseq.Editor.appendBlockInPage(
          page!.originalName,
          `{{renderer excalidraw-menu, ${fileName}}}`
        );
        await logseq.Editor.appendBlockInPage(
          page!.originalName,
          genBlockData(DEFAULT_EXCALIDRAW_DATA)
        );
        logseq.Editor.updateBlock(uuid, `{{renderer excalidraw, ${fileName}}}`);
      } catch (error) {
        logseq.UI.showMsg(i18nCreateDrawing.errorMsg, "error");
        console.error("[faiz:] === create excalidraw error", error);
      }
    }
  );
};

export default bootCommand;
