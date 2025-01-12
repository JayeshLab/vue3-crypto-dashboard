import type { Ticker } from '@/types'
import Api from './api'
import { useStore } from '@/stores'

const wsApi = new Api()
const store = useStore()
const subscribeSymbol = function (symbol: string) {
  wsApi.onTicker(
    symbol,
    (ticker: { c: string; q: string; P: string; p: any; h: any; l: any; o: any; E: any }) => {
      const tick: Ticker = {
        price: parseFloat(ticker.c),
        vol: parseFloat(ticker.q).toFixed(2),
        percent: parseFloat(ticker.P).toFixed(2),
        chg: ticker.p,
        high: ticker.h,
        low: ticker.l,
        open: ticker.o,
        time: ticker.E,
        symbol: symbol
      }
      store.updateTicker(tick)
    }
  )
}
const unSubscribeSymbol = function (symbol: string) {
  wsApi.closeSubscription('ticker', false, symbol)
}

const subscribeChart = function (symbol: string, interval: number) {
  wsApi.onKline(symbol, interval, () => {})
}
const unSubscribeChart = function (symbol: string, interval: number) {
  wsApi.closeSubscription('kline', false, symbol, interval)
}
export { subscribeSymbol, unSubscribeSymbol, subscribeChart, unSubscribeChart }
