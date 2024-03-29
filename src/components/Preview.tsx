import { exportToSvg } from '@excalidraw/excalidraw'
import React, { useEffect, useRef } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'

import { getExcalidrawInfoFromPage } from '@/lib/utils'

import type { Theme } from './Editor'

const Preview: React.FC<React.PropsWithChildren<{ pageName: string }>> = ({ pageName }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pageName) {
      getExcalidrawInfoFromPage(pageName).then(async ({ excalidrawData }) => {
        const theme = await logseq.App.getStateFromStore<Theme>('ui/theme')
        const svg = await exportToSvg({
          elements: excalidrawData?.elements ?? [],
          appState: {
            ...(excalidrawData?.appState ?? {}),
            exportWithDarkMode: theme === 'dark',
          },
          files: excalidrawData?.files ?? null,
        })
        const width = Number(svg.getAttribute('width')) || 100
        const height = Number(svg.getAttribute('height')) || 80
        if (containerRef?.current) {
          // display svg in full screen based on aspect radio
          const aspectRadio = width / height
          const windowAspectRadio = window.innerWidth / window.innerHeight
          if (aspectRadio > windowAspectRadio) {
            svg.style.width = '100vw'
            svg.style.height = 'auto'
          } else {
            svg.style.width = 'auto'
            svg.style.height = '100vh'
          }

          containerRef.current.appendChild(svg)
        }
      })
    }
  }, [pageName])

  return (
    <>
      <div ref={containerRef} className="z-10 max-w-[100vw]"></div>
      <div className="fixed top-5 right-5 text-2xl z-20">
        <AiFillCloseCircle className="cursor-pointer" onClick={() => logseq.hideMainUI()} />
      </div>
    </>
  )
}

export default Preview
