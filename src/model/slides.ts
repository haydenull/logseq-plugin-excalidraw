import type { ExcalidrawFrameElement } from '@excalidraw/excalidraw/types/element/types'
import { atom } from 'jotai'

export const framesAtom = atom<
  {
    frameElement: ExcalidrawFrameElement
    blobPromise: Promise<Blob>
  }[]
>([])

export const activeFrameIdAtom = atom<string | null>(null)
