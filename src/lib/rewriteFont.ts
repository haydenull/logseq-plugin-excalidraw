import { pick } from 'lodash-es'

import { FONT_ID } from '@/lib/constants'
import type { PluginSettings, PluginSettingsKeys } from '@/type'

const rewriteFont = (
  fontFamily: string,
  fontUrl: string,
  // fontType = "font/woff2"
) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = fontUrl
  link.as = 'font'
  // link.type = fontType;
  // link.crossOrigin = 'anonymous'
  document.head.appendChild(link.cloneNode(true))
  parent.document.head.appendChild(link.cloneNode(true))

  const style = document.createElement('style')
  style.innerHTML = `
    @font-face {
      font-family: "${fontFamily}";
      src: url("${fontUrl}");
      font-display: swap;
    }
  `
  document.head.appendChild(style.cloneNode(true))
  parent.document.head.appendChild(style.cloneNode(true))
}

const rewriteAllFont = async () => {
  const settings = logseq.settings as unknown as PluginSettings
  const fontSettings = pick(settings, Object.keys(FONT_ID))
  for (const [name, url] of Object.entries(fontSettings)) {
    const _url = (url as string)?.trim?.()
    if (_url) rewriteFont(FONT_ID[name as PluginSettingsKeys], _url)
  }
}

export default rewriteAllFont
