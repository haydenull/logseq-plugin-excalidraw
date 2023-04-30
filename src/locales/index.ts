import type { Language } from "@excalidraw/excalidraw/types/i18n";
import en from "./en";
import zhCN from "./zh-CN";
import { PluginSettings } from "@/type";
import { getLangCode } from "@/lib/utils";

export const DEFAULT_LANGUAGE: Language = { code: "en", label: "English" };

/**
 * languages
 * The value here must be one of the excalidraw languages
 * https://github.com/excalidraw/excalidraw/blob/master/src/i18n.ts#L14
 */
export const LANGUAGES = [DEFAULT_LANGUAGE].concat([
  { code: "zh-CN", label: "简体中文" },
]);

const i18nData = {
  en,
  "zh-CN": zhCN,
};

export type I18N = typeof en;

const getI18N = () => {
  const i18n: I18N =
    i18nData[
      getLangCode((logseq.settings as unknown as PluginSettings).langCode)
    ];
  return i18n;
};

export default getI18N;
