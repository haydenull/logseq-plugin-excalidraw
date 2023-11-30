import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

import useSlides from '@/hook/useSlides'
import { cn } from '@/lib/utils'
import getI18N from '@/locales'

import { type Theme } from './Editor'
import PreviewImage from './PreviewImage'

const SlidesPreview = ({ api, theme }: { api: ExcalidrawImperativeAPI | null; theme?: Theme }) => {
  const { editor: i18nEditor } = getI18N()
  const { frames, activeFrameId, scrollToFrame } = useSlides(api)

  const onClickFrame = (frame) => {
    scrollToFrame(frame)
  }
  return (
    <div
      className={cn(
        'fixed h-1/2 top-1/3 left-0 w-[156px] flex z-50 gap-2 flex-col  p-2 rounded-lg overflow-y-auto custom-scroll',
        theme === 'dark' ? 'text-white bg-[#23232a]' : 'text-black bg-gray-100',
      )}
    >
      {frames.length > 0 ? (
        frames?.map(({ frameElement: frame, blobPromise }) => (
          <div
            key={frame.id}
            className={cn('cursor-pointer border rounded relative overflow-hidden shrink-0', {
              'border-black': frame.id === activeFrameId && theme === 'light',
              'border-gray-400': frame.id === activeFrameId && theme === 'dark',
            })}
            onClick={() => onClickFrame(frame)}
          >
            <PreviewImage blobPromise={blobPromise} />
            <div
              className={cn(
                'absolute bottom-0 w-full opacity-70 text-center py-0.5 px-1 truncate',
                theme === 'dark' ? 'bg-[#31313b]' : 'bg-gray-100',
              )}
            >
              {frame.name || frame.id}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm">{i18nEditor.frameNotFound}</div>
      )}
    </div>
  )
}

export default SlidesPreview
