export interface RequestEvent {
  origin: string
  ip: string
  method: string
  statusCode: number
  type: ResourceType
  url: string
}

type ResourceType =
  | 'main_frame'
  | 'sub_frame'
  | 'stylesheet'
  | 'script'
  | 'image'
  | 'font'
  | 'object'
  | 'xmlhttprequest'
  | 'ping'
  | 'csp_report'
  | 'media'
  | 'websocket'
  | 'other'

export class WebsiteRequest {
  websites: {
    [key: string]: RequestEvent[]
  }

  constructor() {
    this.websites = {}
  }

  addRequest(request: chrome.webRequest.WebResponseCacheDetails) {
    if (!this.websites[request.initiator]) {
      this.websites[request.initiator] = []
    }
    if (request.type === 'xmlhttprequest' && request.method !== 'OPTIONS') {
      const requestUrl = new URL(request.url)
      const find = this.websites[request.initiator].find((item) => {
        return item.origin === requestUrl.origin
      })
      if (!find) {
        this.websites[request.initiator].push({
          origin: requestUrl.origin,
          ip: request.ip,
          method: request.method,
          statusCode: request.statusCode,
          type: request.type,
          url: request.url
        })
      }
    }
  }

  getRequest(initiator: string) {
    return this.websites[initiator]
  }

  clear() {
    this.websites = {}
  }
}
