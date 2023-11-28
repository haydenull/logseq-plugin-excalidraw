import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { CgClose } from 'react-icons/cg'

import useSlides from '@/hook/useSlides'
import { cn } from '@/lib/utils'
import getI18N from '@/locales'

import type { Theme } from './Editor'
import PreviewImage from './PreviewImage'

const SlidesOverview = ({
  api,
  theme,
  open,
  onClose,
  className,
}: {
  open?: boolean
  onClose: () => void
  api: ExcalidrawImperativeAPI | null
  theme?: Theme
  className?: string
}) => {
  const { editor: i18nEditor } = getI18N()
  const { frames, activeFrameId, scrollToFrame } = useSlides(api)

  const onClickFrame = (frame) => {
    scrollToFrame(frame)
    onClose()
  }
  return open ? (
    <div className={cn('p-16 bg-background/80 backdrop-blur-sm', className)}>
      {frames.length > 0 ? (
        <div
          className="w-full h-full grid gap-8 overflow-y-auto justify-items-center"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridTemplateRows: 'repeat(auto-fit, 180px)',
          }}
        >
          {frames?.map(({ frameElement: frame, blobPromise }, index) => (
            <div key={frame.id} className="relative">
              <div
                className={cn('cursor-pointer border w-[300px] h-[180px] rounded relative overflow-hidden', {
                  'border-black': frame.id === activeFrameId && theme === 'light',
                  'border-gray-400': frame.id === activeFrameId && theme === 'dark',
                })}
                onClick={() => onClickFrame(frame)}
              >
                <div className="w-full h-full overflow-hidden">
                  <PreviewImage blobPromise={blobPromise} />
                </div>
                <div
                  className={cn(
                    'absolute bottom-0 w-full opacity-70 text-center py-1 px-1 truncate',
                    theme === 'dark' ? 'bg-[#31313b]' : 'bg-gray-100',
                  )}
                >
                  {frame.name || frame.id}
                </div>
              </div>
              <div className={cn('absolute top-0 left-[305px]', theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl">{i18nEditor.frameNotFound}</div>
      )}
      <div className="fixed top-5 right-5 text-2xl z-20">
        <CgClose className="cursor-pointer" onClick={onClose} />
      </div>
    </div>
  ) : null
}

export default SlidesOverview
