import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
import { FONT_ID } from "@/lib/constants";

export type ExcalidrawData = {
  elements: ExcalidrawElement[];
  appState?: AppState;
  files: null | BinaryFiles;
};

export type SettingItemSchema<TKey> = SettingSchemaDesc & {
  key: TKey;
};

export type PluginSettingsKeys = keyof typeof FONT_ID;
export type PluginSettings = Record<PluginSettingsKeys, string>;
