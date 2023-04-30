import { FONT_ID } from "@/lib/constants";
import { PluginSettings, PluginSettingsKeys } from "@/type";

const rewriteFont = (
  fontFamily: string,
  fontUrl: string,
  fontType = "font/woff2"
) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = fontUrl;
  link.as = "font";
  link.type = fontType;
  // link.crossOrigin = 'anonymous'
  document.head.appendChild(link);
  parent.document.head.appendChild(link);

  const style = document.createElement("style");
  style.innerHTML = `
    @font-face {
      font-family: "${fontFamily}";
      src: url("${fontUrl}");
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
  parent.document.head.appendChild(style);
};

const rewriteAllFont = async () => {
  const settings = logseq.settings as unknown as PluginSettings;
  for (const [name, url] of Object.entries(settings)) {
    const _url = url?.trim?.();
    if (Boolean(_url)) rewriteFont(FONT_ID[name as PluginSettingsKeys], _url);
  }
};

export default rewriteAllFont;
