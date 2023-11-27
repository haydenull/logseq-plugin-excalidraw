import { exportToBlob } from '@excalidraw/excalidraw'
import { type ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import React, { useState } from 'react'

const SlidesPreview = ({
  elements,
  files,
  api,
}: {
  elements?: readonly ExcalidrawElement[]
  files: BinaryFiles | null
  api: ExcalidrawImperativeAPI | null
}) => {
  console.log('[faiz:] === elements', elements)
  const frames = elements?.filter((element) => element.type === 'frame')
  console.log('[faiz:] === frames', frames)
  const images = frames?.map((frame) => {
    return exportToBlob({
      elements: [frame],
      files,
    })
  })
  console.log('[faiz:] === images', images)
  const onClickFrame = (frame) => {
    console.log('[faiz:] === api', api)
    api?.scrollToContent(frame, {
      animate: true,
      duration: 500,
      fitToViewport: true,
    })
  }
  return (
    <div className="fixed h-1/2 top-1/3 right-0 w-28 text-white z-50 gap-2 flex flex-col">
      {frames?.map((frame) => (
        <div key={frame.id} onClick={() => onClickFrame(frame)}>
          {frame.id}
        </div>
      ))}
    </div>
  )
}

export default SlidesPreview
