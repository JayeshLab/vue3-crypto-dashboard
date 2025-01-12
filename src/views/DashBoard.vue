<template>
  <div class="content-box">
    <div class="menu-bar">
      <SearchableDropdown
        id="base"
        :options="currencyOptions"
        value-key="key"
        v-model="baseCurrency"
        placeholder="Select Token"
      ></SearchableDropdown>
      <span class="slash">/</span>
      <SearchableDropdown
        id="quote"
        :options="quoteOptions"
        :searchable="false"
        v-model="quote"
        @input="resetBase"
        style="width: 100px"
      ></SearchableDropdown>
      <button class="add-btn" @click="addCoinPair">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus-lg"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
          />
        </svg>
      </button>
    </div>
    <CryptoBoard></CryptoBoard>
    <button class="clear-btn" @click="clear">Clear All</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import SearchableDropdown from '@/components/SearchableDropdown.vue'
import CryptoBoard from './CryptoBoard.vue'
import coins from '@/assets/group.json'
import { subscribeSymbol } from '../services/binance'
import type { Coin, Coins } from '@/types'
import { useStore } from '@/stores'

const currencyList = coins as Coins
const quote = ref('BNB')
const baseCurrency: Ref<string | null> = ref(null)
const store = useStore()
const quoteOptions = computed(() => {
  return Object.keys(coins)
})
const currencyOptions = computed(() => {
  return currencyList[quote.value]['pairs']
})
const resetBase = () => (baseCurrency.value = null)
const clear = () => {
  localStorage.clear()
  location.reload()
}

const addCoinPair = () => {
  if (baseCurrency.value) {
    const symbol = `${baseCurrency.value}${quote.value}`
    const coin: Coin = currencyOptions.value.find((c) => c.key === baseCurrency.value)!
    subscribeSymbol(symbol)
    store.addCoinPair({
      symbol: symbol,
      base: baseCurrency.value,
      quote: quote.value,
      name: coin.name,
      img: coin.img
    })
  }
}
onMounted(() => {
  // Subscribe to all stored currencies on start
  if (store.currencies) {
    store.currencies.forEach((currency) => {
      subscribeSymbol(currency.symbol)
    })
  }
})
</script>
