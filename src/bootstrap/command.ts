import { createDrawing } from '@/lib/utils'
import getI18N from '@/locales'

const bootCommand = () => {
  const { createDrawing: i18nCreateDrawing } = getI18N()
  // slash command: create excalidraw
  logseq.Editor.registerSlashCommand(i18nCreateDrawing.tag, async ({ uuid }) => {
    const drawingPage = await createDrawing()
    if (!drawingPage) return
    logseq.Editor.updateBlock(uuid, `{{renderer excalidraw, ${drawingPage.fileName}}}`)
  })
}

export default bootCommand
