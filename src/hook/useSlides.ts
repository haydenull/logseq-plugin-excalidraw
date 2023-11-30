import { exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawElement, ExcalidrawFrameElement, Theme } from '@excalidraw/excalidraw/types/element/types'
import type { BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { useAtom } from 'jotai'
import { groupBy } from 'lodash-es'

import { activeFrameIdAtom, framesAtom } from '@/model/slides'

const useSlides = (api: ExcalidrawImperativeAPI | null) => {
  const [frames, setFrames] = useAtom(framesAtom)
  const [activeFrameId, setActiveFrameId] = useAtom(activeFrameIdAtom)
  const activeFrameIndex = frames?.findIndex(({ frameElement: frame }) => frame.id === activeFrameId)
  const isFirst = activeFrameIndex === 0
  const isLast = activeFrameIndex === frames?.length - 1

  const updateFrames = (params: GetFramesParams) => {
    setFrames(getFrames(params))
  }
  const scrollToFrame = (frame: ExcalidrawFrameElement) => {
    api?.scrollToContent(frame, {
      animate: true,
      duration: 300,
      fitToViewport: true,
    })
    setActiveFrameId(frame.id)
  }
  const next = () => {
    if (isLast) return
    const index = activeFrameIndex < 0 ? 0 : activeFrameIndex + 1
    scrollToFrame(frames[index].frameElement)
  }
  const prev = () => {
    if (isFirst) return
    const index = activeFrameIndex < 0 ? 0 : activeFrameIndex - 1
    scrollToFrame(frames[index].frameElement)
  }

  return {
    frames,
    activeFrameId,
    activeFrameIndex,
    isFirst,
    isLast,

    updateFrames,
    scrollToFrame,
    prev,
    next,
  }
}

type GetFramesParams = {
  elements?: readonly ExcalidrawElement[]
  files: BinaryFiles | null
  theme?: Theme
}
function getFrames({ elements, files, theme }: GetFramesParams) {
  const frames: ExcalidrawFrameElement[] = (
    elements?.filter((element) => element.type === 'frame' && !element.isDeleted) as ExcalidrawFrameElement[]
  )?.sort((a, b) => {
    const getIndex = (name: string | null) => {
      const defaultIndex = 9999
      if (!name) return defaultIndex
      const index = Number(name.split('-')[0])
      return isNaN(index) ? defaultIndex : index
    }
    return getIndex(a.name) - getIndex(b.name)
  })
  const frameChildrenElementsMap: Record<string, ExcalidrawElement[]> = groupBy(elements, (element) => element.frameId)
  return frames?.map((frame) => ({
    frameElement: frame,
    blobPromise: exportToBlob({
      elements: [frame, ...(frameChildrenElementsMap[frame.id] || [])],
      files,
      appState: {
        exportWithDarkMode: theme === 'dark',
      },
    }),
  }))
}

export default useSlides
