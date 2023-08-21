import { exportToSvg } from '@excalidraw/excalidraw'
import { useAtom } from 'jotai'
import { LogOut, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import DrawingCard, { PREVIEW_WINDOW, type IPageWithDrawing } from '@/components/DrawingCard'
import CreateDrawingModal, { EditTypeEnum } from '@/components/EditDrawingInfoModal'
import Editor, { EditorTypeEnum, type Theme } from '@/components/Editor'
import TagSelector from '@/components/TagSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/toaster'
import { getExcalidrawInfoFromPage, getExcalidrawPages, getTags, setTheme } from '@/lib/utils'
import { tagsAtom } from '@/model/tags'

/**
 * Get all drawing pages and generate svg for each page
 */
const getAllPages = async (): Promise<IPageWithDrawing[]> => {
  const pages = await getExcalidrawPages()
  if (!pages) return []

  const theme = await logseq.App.getStateFromStore<Theme>('ui/theme')
  const promises = pages.map(async (page) => {
    const { excalidrawData, rawBlocks } = await getExcalidrawInfoFromPage(page.name)
    const svg = await exportToSvg({
      elements: excalidrawData?.elements ?? [],
      // appState: ,
      appState: {
        ...(excalidrawData?.appState ?? {}),
        exportWithDarkMode: theme === 'dark',
      },
      exportPadding: 20,
      files: excalidrawData?.files ?? null,
    })
    const width = Number(svg.getAttribute('width')) || 100
    const height = Number(svg.getAttribute('height')) || 80
    // display svg in full screen based on aspect radio
    const aspectRadio = width / height
    const windowAspectRadio = PREVIEW_WINDOW.width / PREVIEW_WINDOW.height
    if (aspectRadio > windowAspectRadio) {
      svg.style.width = PREVIEW_WINDOW.width + 'px'
      svg.style.height = 'auto'
    } else {
      svg.style.width = 'auto'
      svg.style.height = PREVIEW_WINDOW.height + 'px'
    }

    const firstBlock = rawBlocks?.[0]
    const drawAlias = firstBlock?.properties?.excalidrawPluginAlias
    const drawTag = firstBlock?.properties?.excalidrawPluginTag
    return {
      ...page,
      drawSvg: svg,
      drawAlias,
      drawTag,
      drawRawBlocks: rawBlocks,
    }
  })
  return Promise.all(promises)
}

const DashboardApp = () => {
  const [allPages, setAllPages] = useState<IPageWithDrawing[]>([])
  const [openCreateDrawingModal, setOpenCreateDrawingModal] = useState(false)
  const [editorInfo, setEditorInfo] = useState<{
    show: boolean
    pageName?: string
  }>({
    show: false,
  })
  const [, setTags] = useAtom(tagsAtom)
  const [filterTag, setFilterTag] = useState<string>()
  const [filterInput, setFilterInput] = useState<string>('')

  const pagesAfterFilter = allPages.filter((page) => {
    const _filterInput = filterInput?.trim()
    const _filterTag = filterTag?.trim()

    // show all drawings if no filter
    const hasFilterTag = _filterTag ? page.drawTag?.toLowerCase().includes(_filterTag) : true
    const hasFilterInput = _filterInput ? page.drawAlias?.toLowerCase().includes(_filterInput) : true
    return hasFilterTag && hasFilterInput
  })

  const onClickReset = () => {
    setFilterInput('')
    setFilterTag('')
  }
  const onClickDrawing = (page: IPageWithDrawing) => {
    setEditorInfo({
      show: true,
      pageName: page.originalName,
    })
  }
  const onDeleteDrawing = (page: IPageWithDrawing) => {
    setAllPages(allPages.filter((p) => p.originalName !== page.originalName))
  }

  const refresh = () => {
    getAllPages().then(setAllPages)
  }

  useEffect(() => {
    getAllPages().then(setAllPages)
  }, [])
  useEffect(() => {
    getTags().then(setTags)
  }, [])
  // initialize theme
  useEffect(() => {
    logseq.App.getStateFromStore<Theme>('ui/theme').then(setTheme)
  }, [])

  return (
    <>
      <div className="py-5 px-10 w-screen h-screen overflow-auto custom-scroll">
        <div className="flex justify-center my-8">
          <div className="flex gap-2 max-w-2xl flex-1 justify-between">
            <Input
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder="Filter drawings..."
            />
            <TagSelector asFilter value={filterTag} onChange={setFilterTag} />
            {Boolean(filterTag) || Boolean(filterInput) ? (
              <Button variant="ghost" onClick={onClickReset}>
                Reset <X size="16" className="ml-2" />
              </Button>
            ) : null}
            <Button className="ml-10" onClick={() => setOpenCreateDrawingModal(true)}>
              Create
            </Button>
            <Button variant="outline" onClick={() => logseq.hideMainUI()}>
              <LogOut size="15" />
            </Button>
          </div>
        </div>
        <section
          className="grid gap-4 justify-center"
          style={{
            gridTemplateColumns: `repeat(auto-fill,${PREVIEW_WINDOW.width}px)`,
          }}
        >
          {pagesAfterFilter.map((page) => (
            <DrawingCard
              key={page.id}
              page={page}
              onClickDrawing={onClickDrawing}
              onDelete={onDeleteDrawing}
              onChange={refresh}
            />
          ))}
        </section>
        {editorInfo.show && editorInfo.pageName && (
          <div className="fixed top-0 left-0 w-screen h-screen">
            <Editor
              key={editorInfo.pageName}
              pageName={editorInfo.pageName}
              type={EditorTypeEnum.Page}
              onClose={() => setEditorInfo({ show: false })}
            />
          </div>
        )}
      </div>
      <Toaster />
      <CreateDrawingModal
        type={EditTypeEnum.Create}
        open={openCreateDrawingModal}
        onOpenChange={setOpenCreateDrawingModal}
        onOk={refresh}
      />
    </>
  )
}

export default DashboardApp
