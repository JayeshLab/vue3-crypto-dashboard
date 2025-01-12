interface WsEvent extends Event {
  endpoint: string
}
type MessageHandler = (message: MessageEvent) => void
type ErrorHandler = (error: WsEvent) => void
type EventHandler = (event: WsEvent) => void

interface WebSocketWrapperOptions {
  url: string
  reconnectInterval?: number // in milliseconds
  maxReconnectAttempts?: number
}

class WebSocketWrapper {
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts: number = 0
  private websocket: WebSocket | null = null
  private isConnected: boolean = false

  private messageHandlers: MessageHandler[] = []
  private errorHandlers: ErrorHandler[] = []
  private onOpenHandler: EventHandler | null = null
  private onCloseHandler: ErrorHandler | null = null

  constructor(options: WebSocketWrapperOptions) {
    this.url = options.url
    this.reconnectInterval = options.reconnectInterval ?? 5000
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity
    this.connect()
  }

  public connect(): void {
    if (this.isConnected) return

    this.websocket = new WebSocket(this.url)

    this.websocket.onopen = (ev: Event) => {
      console.log('WebSocket connected')
      const e: WsEvent = { ...ev, endpoint: this.url }
      this.isConnected = true
      this.reconnectAttempts = 0
      if (this.onOpenHandler) this.onOpenHandler(e)
    }

    this.websocket.onmessage = (event) => {
      this.messageHandlers.forEach((handler) => handler(event))
    }

    this.websocket.onerror = (error) => {
      console.error('WebSocket error', error)
      const errorEvent: WsEvent = { ...error, endpoint: this.url }
      this.errorHandlers.forEach((handler) => handler(errorEvent))
    }

    this.websocket.onclose = (ev: CloseEvent) => {
      console.warn('WebSocket closed')
      this.isConnected = false
      const closeEvent: WsEvent = { ...ev, endpoint: this.url }
      if (this.onCloseHandler) this.onCloseHandler(closeEvent)
      ev.code !== 1e3 && ev.code !== 1005 && this.reconnect()
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached. Giving up.')
      return
    }

    this.reconnectAttempts++
    console.log(`Reconnecting in ${this.reconnectInterval / 1000} seconds...`)
    setTimeout(() => this.connect(), this.reconnectInterval)
  }

  public close(): void {
    this.websocket?.close()
    this.isConnected = false
  }

  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler)
  }

  public onError(handler: ErrorHandler): void {
    this.errorHandlers.push(handler)
  }

  public onOpen(handler: EventHandler): void {
    this.onOpenHandler = handler
  }

  public onClose(handler: ErrorHandler): void {
    this.onCloseHandler = handler
  }
}

export default WebSocketWrapper
