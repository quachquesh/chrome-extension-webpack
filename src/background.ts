import { WebsiteRequest } from './types/websiteRequest'

const websiteRequest = new WebsiteRequest()

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension đã được cài đặt.')
})

chrome.runtime.onStartup.addListener(() => {
  console.log('Extension đã được khởi động.')
})

// chrome.runtime.onMessage.addListener((message) => {
//   console.log('message', message)
//   if (message === 'reload-extension') {
//     chrome.runtime.reload()
//   }
// })

// chrome.webRequest.onBeforeRequest.addListener(
//   function (request) {
//     console.log('[onBeforeRequest] request', request)
//   },
//   { urls: ['<all_urls>'] }
// )

chrome.webRequest.onCompleted.addListener(
  function (request) {
    websiteRequest.addRequest(request)
  },
  { urls: ['<all_urls>'] },
  ['extraHeaders', 'responseHeaders']
)

chrome.runtime.onConnect.addListener(async (port) => {
  console.log('port', port)
  const currentOrigin = port.name
  port.postMessage({
    type: 'get-website-request',
    websiteRequest: websiteRequest.getRequest(currentOrigin)
  })
})
