export type Symbol = {
  symbol: string
  base?: string
  quote?: string
  name?: string
  img: string
}

export type Ticker = {
  symbol: string
  price?: number
  vol?: string
  percent?: string
  chg?: string
  high?: string
  low?: string
  open?: string
  time?: number
  pchg?: number
}
export type Stream = {
  depth: (symbol: string) => string
  depthLevel: (symbol: string, level: number) => string
  kline: (symbol: string, interval: number) => string
  aggTrade: (symbol: string) => string
  trade: (symbol: string) => string
  ticker: (symbol: string) => string
  miniTicker: (symbol: string) => string
  allMiniTicker: () => string
  allTickers: () => string
}

export type Coin = {
  key: string
  name: string
  label?: string
  img: string
}
export type Coins = {
  [key: string]: {
    name: string
    pairs: Coin[]
  }
}

export type SparklineProps = {
  pair: string
  info: Symbol
}

export type StockData = {
  Date: number
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
}
