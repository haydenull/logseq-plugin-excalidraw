import { exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawFrameElement, ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { groupBy } from 'lodash-es'

import { cn } from '@/lib/utils'

import { type Theme } from './Editor'
import PreviewImage from './PreviewImage'

const SlidesPreview = ({
  elements,
  files,
  api,
  theme,
}: {
  elements?: readonly ExcalidrawElement[]
  files: BinaryFiles | null
  api: ExcalidrawImperativeAPI | null
  theme?: Theme
}) => {
  // console.log('[faiz:] === elements', elements)
  const frames: ExcalidrawFrameElement[] = (
    elements?.filter((element) => element.type === 'frame') as ExcalidrawFrameElement[]
  ).sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : a.id.localeCompare(b.id)))
  // console.log('[faiz:] === frames', frames)
  const frameChildrenElementsMap = groupBy(elements, (element) => element.frameId)
  // console.log('[faiz:] === frameChildrenMap', frameChildrenElementsMap)

  const onClickFrame = (frame) => {
    console.log('[faiz:] === api', api)
    api?.scrollToContent(frame, {
      animate: true,
      duration: 300,
      fitToViewport: true,
    })
  }
  return (
    <div
      className={cn(
        'fixed h-1/2 top-1/3 left-0 w-[200px]  z-50 gap-2 flex flex-col bg-gray-100 p-2 rounded-lg',
        theme === 'dark' ? 'text-white' : 'text-black',
      )}
    >
      {frames?.map((frame) => (
        <div
          key={frame.id}
          className="cursor-pointer border hover:bg-gray-200 rounded relative"
          onClick={() => onClickFrame(frame)}
        >
          <PreviewImage
            blobPromise={exportToBlob({ elements: [frame, ...frameChildrenElementsMap[frame.id]], files })}
          />
          <div className="absolute bottom-0 bg-gray-100 w-full opacity-50 text-center py-1">
            {frame.name || frame.id}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SlidesPreview
