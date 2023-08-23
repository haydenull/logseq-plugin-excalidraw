import '@logseq/libs'
import React from 'react'
import { type Root, createRoot } from 'react-dom/client'

import EditorApp from '@/app/Editor'
import PreviewApp from '@/app/Preview'
import bootCommand from '@/bootstrap/command'
import bootExcalidrawLibraryItems from '@/bootstrap/excalidrawLibraryItems'
import bootModels from '@/bootstrap/model'
import bootRenderBlockImage from '@/bootstrap/renderBlockImage'
import { proxyLogseq } from '@/lib/logseqProxy'
import rewriteAllFont from '@/lib/rewriteFont'
import { getSettingsSchema } from '@/lib/utils'

import DashboardApp from './app/Dashboard'
import './index.css'

const isDevelopment = import.meta.env.DEV
let reactAppRoot: Root | null = null

console.log('=== logseq-plugin-excalidraw loaded ===')

if (isDevelopment) {
  // run in browser
  proxyLogseq()

  renderApp({ mode: 'dashboard' })

  // bootModels(renderApp);
  // toolbar item
  // logseq.App.registerUIItem("toolbar", {
  //   key: "logseq-plugin-excalidraw",
  //   template:
  //     '<a data-on-click="showDashboard" class="button"><i class="ti ti-window"></i></a>',
  // });
} else {
  // run in logseq
  logseq.ready(() => {
    logseq.on('ui:visible:changed', (e) => {
      if (!e.visible) {
        // ReactDOM.unmountComponentAtNode(
        //   document.getElementById("root") as Element
        // );
        reactAppRoot?.unmount?.()
      }
    })

    // fix: https://github.com/haydenull/logseq-plugin-excalidraw/issues/6
    logseq.setMainUIInlineStyle({ zIndex: 9999 })

    bootModels(renderApp)

    // toolbar item
    logseq.App.registerUIItem('toolbar', {
      key: 'logseq-plugin-excalidraw',
      template: '<a data-on-click="showDashboard" class="button"><i class="ti ti-scribble"></i></a>',
    })

    // render excalidraw block svg
    bootRenderBlockImage()

    // initialize excalidraw library items
    bootExcalidrawLibraryItems()

    bootCommand()

    const settingsSchema = getSettingsSchema()
    logseq.useSettingsSchema(settingsSchema)

    rewriteAllFont()
  })
}

export type Mode = 'edit' | 'preview' | 'dashboard'
export type RenderAppProps =
  | { mode: 'dashboard' }
  | {
      mode: 'preview'
      pageName: string
    }
  | {
      mode: 'edit'
      pageName: string
      renderSlotId: string
    }
function renderApp(props: RenderAppProps) {
  let App: React.ReactNode = null
  switch (props.mode) {
    case 'dashboard':
      App = <DashboardApp />
      break
    case 'preview':
      App = <PreviewApp pageName={props.pageName} />
      break
    case 'edit':
      App = <EditorApp pageName={props.pageName} renderSlotId={props.renderSlotId} />
  }

  const container = document.getElementById('root')
  reactAppRoot = createRoot(container!)
  reactAppRoot.render(<React.StrictMode>{App}</React.StrictMode>)
}
