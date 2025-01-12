import WebSocketWrapper from './WebSocketWrapper'
import type { Stream } from '@/types'

export default class Api {
  private maxAttempts: number
  private timeout: number
  private _baseUrl: string
  private _combinedBaseUrl: string
  private subscription: any
  private streams: Stream

  constructor(timeout = 5e3, maxAttempts = 5) {
    this.timeout = timeout
    this.maxAttempts = maxAttempts
    this._baseUrl = 'wss://stream.binance.com:9443/ws/'
    this._combinedBaseUrl = 'wss://stream.binance.com:9443/stream?streams='
    this.subscription = {}
    this.streams = {
      depth: (symbol: string) => `${symbol.toLowerCase()}@depth` as string,
      depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
      kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
      aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
      trade: (symbol) => `${symbol.toLowerCase()}@trade`,
      ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
      miniTicker: (symbol) => `${symbol.toLowerCase()}@miniTicker`,
      allMiniTicker: () => `!miniTicker@arr`,
      allTickers: () => '!ticker@arr'
    }
  }
  subscribe(cb: any, endpoint: string, isCombined = false) {
    try {
      const path = (isCombined ? this._combinedBaseUrl : this._baseUrl) + endpoint
      if (this.subscription[path]) {
        return this.subscription[path]
      }
      const ws = new WebSocketWrapper({
        url: path,
        reconnectInterval: 3000,
        maxReconnectAttempts: this.maxAttempts
      })
      ws.onOpen(() => {
        console.log('Connected to the WebSocket!')
      })

      ws.onMessage((event) => {
        cb(JSON.parse(event.data))
      })

      ws.onError((error) => {
        console.error('WebSocket error:', error)
        this.removeSubscription(error.endpoint)
      })

      ws.onClose((error) => {
        console.warn('WebSocket connection closed.')
        this.removeSubscription(error.endpoint)
      })
      this.subscription[path] = ws
    } catch (ex) {
      console.log('Error :' + ex)
    }
  }
  caller(fname: string, args: any[]) {
    const streamKey = fname as keyof Stream
    return (this.streams[streamKey] as any)(...args)
  }
  removeSubscription(endpoint: string) {
    if (this.subscription[endpoint]) {
      delete this.subscription[endpoint]
    }
  }
  closeSubscription(type: string, isCombined = false, ...args: any[]) {
    const endpoint = this.caller(type, args)
    const path = (isCombined ? this._combinedBaseUrl : this._baseUrl) + endpoint
    const ws = this.subscription[path]
    if (ws) {
      ws.close(1000, '')
    }
  }
  closeAll() {
    for (const key in this.subscription) {
      this.subscription[key].close()
      delete this.subscription[key]
    }
    this.subscription = {}
  }
  onDepthUpdate(symbol: string, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.depth(symbol))
  }

  onDepthLevelUpdate(symbol: string, level: number, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.depthLevel(symbol, level))
  }

  onKline(symbol: string, interval: number, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.kline(symbol, interval))
  }

  onAggTrade(symbol: string, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.aggTrade(symbol))
  }

  onTrade(symbol: string, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.trade(symbol))
  }

  onTicker(symbol: string, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.ticker(symbol))
  }
  onMiniTicker(symbol: string, eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.miniTicker(symbol))
  }
  onAllMiniTickers(eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.allMiniTicker())
  }
  onAllTickers(eventHandler: any) {
    return this.subscribe(eventHandler, this.streams.allTickers())
  }
  onCombinedStream(streams: [], eventHandler: any) {
    return this.subscribe(eventHandler, streams.join('/'), true)
  }
}
