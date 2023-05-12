import { type Language } from "@excalidraw/excalidraw/types/i18n";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { pick } from "lodash";
import type {
  ExcalidrawData,
  PluginSettingsKeys,
  SettingItemSchema,
} from "@/type";
import type {
  BlockEntity,
  PageEntity,
  PageIdentity,
} from "@logseq/libs/dist/LSPlugin.user";
import {
  APP_STATE_PROPERTIES,
  DEFAULT_EXCALIDRAW_DATA,
} from "../lib/constants";
import type {
  AppState,
  LibraryItems,
} from "@excalidraw/excalidraw/types/types";
import getI18N, { DEFAULT_LANGUAGE, LANGUAGES } from "@/locales";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * get excalidraw data
 * ```json\n{xxx}\n``` --> {xxx}
 */
export const getExcalidrawData = (
  text?: string
): ExcalidrawData | LibraryItems | null => {
  const match = text?.match(/```json\n(.*)\n```/s);
  return match ? JSON.parse(match[1]) : null;
};
/**
 * gen block data
 * {xxx} --> ```json\n{xxx}\n```
 */
export const genBlockData = (
  excalidrawData: Record<string, unknown> | LibraryItems
) => {
  return `\`\`\`json\n${JSON.stringify(excalidrawData)}\n\`\`\``;
};

export const getExcalidrawInfoFromPage = async (
  srcPage: PageIdentity
): Promise<{
  excalidrawData: ExcalidrawData;
  /** block that stores the excalidraw data */
  block: BlockEntity;
  /** page blocks */
  rawBlocks: BlockEntity[];
}> => {
  console.log("[faiz:] === srcPage", srcPage);
  const pageBlocks = await logseq.Editor.getPageBlocksTree(srcPage);
  console.log("[faiz:] === pageBlocks", pageBlocks);
  const codeBlock = pageBlocks?.[3];
  const excalidrawData = getExcalidrawData(
    codeBlock?.content
  ) as ExcalidrawData;
  return {
    excalidrawData: excalidrawData || DEFAULT_EXCALIDRAW_DATA,
    block: codeBlock,
    rawBlocks: pageBlocks,
  };
};

/**
 * listen esc keyup event
 */
export const listenEsc = (callback: () => void) => {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      callback();
    }
  });
};

export const createSVGElement = (svgString: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  return svgDoc.documentElement;
};

/**
 * Extract some properties from appState
 */
export const getMinimalAppState = (appState: AppState) => {
  return pick(appState, APP_STATE_PROPERTIES);
};

/**
 * get lang code from language setting
 * en: English -> en
 */
export const getLangCode = (langSetting: string) =>
  langSetting?.split(":")?.[0] || DEFAULT_LANGUAGE.code;

/**
 * join excalidraw lang to logseq setting
 * This method must defined together with SETTINGS_SCHEMA, otherwise plugin will initialize error
 */
export const joinLangCode = (lang: Language) => `${lang.code}: ${lang.label}`;

/**
 * Logseq settings
 */
export const getSettingsSchema =
  (): SettingItemSchema<PluginSettingsKeys>[] => {
    const { settings: i18nSettings } = getI18N();
    return [
      {
        key: "langCode",
        title: i18nSettings.langCode.title,
        type: "enum",
        default: joinLangCode(DEFAULT_LANGUAGE),
        description: i18nSettings.langCode.description,
        enumPicker: "select",
        enumChoices: LANGUAGES?.map(joinLangCode),
      },
      {
        key: "Hand-drawn",
        title: i18nSettings.HandDrawn.title,
        type: "string",
        default: "",
        description: i18nSettings.HandDrawn.description,
      },
      {
        key: "Normal",
        title: i18nSettings.Normal.title,
        type: "string",
        default: "",
        description: i18nSettings.Normal.description,
      },
      {
        key: "Code",
        title: i18nSettings.Code.title,
        type: "string",
        default: "",
        description: i18nSettings.Code.description,
      },
    ];
  };

/**
 * get excalidraw pages
 */
export const getExcalidrawPages = async () => {
  return logseq.DB.q(`(page-property :excalidraw-plugin "true")`);
};

/**
 * create or update logseq page property
 */
export const updateLogseqPageProperty = async (
  pageName: string,
  properties: Record<string, unknown>
) => {
  const upsertBlockPropertyPromises = Object.keys(properties).map((key) =>
    logseq.Editor.upsertBlockProperty(pageName, key, properties?.[key])
  );
  return Promise.allSettled(upsertBlockPropertyPromises);
};

export const getTags = async (): Promise<string[]> => {
  return getExcalidrawPages().then(async (pages) => {
    console.log("[faiz:] === getTags pages", pages);
    if (!pages) return [];
    const promises = pages.map(async (page: PageEntity) => {
      const blocks = await logseq.Editor.getPageBlocksTree(page.originalName);
      return blocks?.[0]?.properties?.excalidrawPluginTag;
    });
    const tags = await Promise.all(promises);
    return tags?.filter(Boolean);
  });
};
