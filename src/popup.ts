import './assets/styles/popup.scss'

import type { RequestEvent } from './types/websiteRequest'
import $ from 'jquery'

document.addEventListener('DOMContentLoaded', () => {
  init()
})

async function init() {
  const currentOrigin = await getCurrentOrigin()
  const port = chrome.runtime.connect(null, { name: currentOrigin })

  port.onMessage.addListener((message: { websiteRequest?: RequestEvent[] }) => {
    console.log('message', message)
    if (message.websiteRequest?.length) {
      $('#result-body').html(
        message.websiteRequest
          .map((item) => `<tr><td>${item.origin}</td><td>${item.ip}</td></tr>`)
          .join('')
      )
    }
  })
}

async function getCurrentOrigin() {
  return await new Promise((resolve: (value: string) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab) {
        const url = new URL(currentTab.url)
        resolve(url.origin)
      } else {
        resolve('')
      }
    })
  })
}
