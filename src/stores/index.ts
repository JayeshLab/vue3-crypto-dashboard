import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import defaultPair from '@/assets/defaultpair.json'
import type { Symbol, Ticker } from '@/types'

const LOCAL_STORAGE_KEY = 'vue3-crypto-currencies'

const getStoredCurrencies = () => {
  const store_currencies = localStorage.getItem(LOCAL_STORAGE_KEY)
  return store_currencies ? JSON.parse(store_currencies) : defaultPair
}

// Setup Store
export const useStore = defineStore('store', () => {
  const currencies: Symbol[] = reactive(getStoredCurrencies()) // Non reactive
  const tickers: Map<string, Ticker> = reactive(new Map() as Map<string, Ticker>) // Reactive Map

  function setDefaultCurrencies() {
    currencies.splice(0, currencies.length)
    currencies.concat(defaultPair)
  }
  // Update the ticker
  function updateTicker(payload: Ticker) {
    const tick = tickers.get(payload.symbol)
    if (tick && payload.price && tick.price) {
      payload.pchg = payload?.price > tick.price ? 1 : -1
    } else {
      payload.pchg = 1
    }
    tickers.set(payload.symbol, payload)
  }
  function addCoinPair(payload: Symbol) {
    const tick = tickers.get(payload.symbol)
    if (!tick) {
      currencies.push(payload)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currencies))
    }
    tickers.set(payload.symbol, { ...{ symbol: payload.symbol, pchg: 1 } })
  }
  function removeCoinPair(symbol: string) {
    tickers.delete(symbol)
    currencies.splice(
      currencies.findIndex((s) => s.symbol === symbol),
      1
    )
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currencies))
  }
  const getSymbolById = computed(() => (symbol: string) => {
    return currencies.find((s) => s.symbol === symbol)
  })
  const getTickerById = computed(() => (symbol: string) => {
    return tickers.get(symbol)
  })
  const hasTicker = computed(() => (symbol: string) => {
    const tick = tickers.get(symbol)
    return tick && tick.price ? true : false
  })
  return {
    currencies,
    tickers,
    setDefaultCurrencies,
    updateTicker,
    addCoinPair,
    removeCoinPair,
    getSymbolById,
    getTickerById,
    hasTicker
  }
})
