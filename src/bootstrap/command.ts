import {
  DEFAULT_EXCALIDRAW_DATA,
  EXCALIDRAW_FILE_PROMPT,
} from "@/helper/constants";
import { genBlockData } from "@/helper/util";
import dayjs from "dayjs";

const bootCommand = () => {
  // slash command: create excalidraw
  logseq.Editor.registerSlashCommand(
    "🎨 Excalidraw: Create New Draw",
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
        logseq.UI.showMsg("Create excalidraw error", "error");
        console.error("[faiz:] === create excalidraw error", error);
      }
    }
  );
};

export default bootCommand;
