<template>
  <div class="container-fluid">
    <div class="row flex-xl-nowrap" v-if="ticker">
      <div class="col">
        <div class="row">
          <div class="col-md-8 mb-3">
            <div class="info-card">
              <div class="row">
                <div class="col">
                  <span
                    class="coin-img"
                    :style="{
                      backgroundImage: `url('https://www.cryptocompare.com${currency.img}')`
                    }"
                  ></span>
                  <div class="coin-name">
                    {{ currency.name }} ({{ currency.base }}) /
                    <span class="small">{{ currency.quote }}</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <span
                    class="price"
                    :style="{ color: ticker.pchg && ticker.pchg > 0 ? 'green' : 'red' }"
                    >{{ ticker.price }}<span class="x-small"> {{ currency.quote }}</span></span
                  >
                </div>
                <div
                  class="col-md-6 chg-block"
                  :class="[ticker.percent && parseFloat(ticker.percent) < 0 ? 'down' : 'up']"
                >
                  <div class="text-dark small text-right">24h Chg</div>
                  <div class="text-right d-flex justify-content-end">
                    <span class="indicator"></span><span>{{ ticker.percent }}%</span>
                  </div>
                  <div class="icon-chg text-right">
                    {{
                      ticker.chg
                        ? parseFloat(ticker.chg).toFixed(currency.quote === 'USDT' ? 3 : 8)
                        : ''
                    }}
                    <span class="x-small">{{ currency.quote }}</span>
                  </div>
                </div>
                <div class="col-12 x-small">{{ timeformat(ticker.time) }}</div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="info-card justify-content-center">
              <div>
                <span class="info-label">24H OPEN </span>{{ priceformat(ticker.open?.toString())
                }}<span class="small"> {{ currency.quote }}</span>
              </div>
              <div>
                <span class="info-label">24H HIGH </span>{{ priceformat(ticker?.high?.toString())
                }}<span class="small"> {{ currency.quote }}</span>
              </div>
              <div>
                <span class="info-label">24H LOW </span>{{ priceformat(ticker.low?.toString()) }}
                <span class="small"> {{ currency.quote }}</span>
              </div>
              <div>
                <span class="info-label">24H VOL </span>{{ ticker.vol
                }}<span class="small"> {{ currency.base }}</span>
              </div>
            </div>
          </div>
          <div class="col-12 mb-3">
            <CoinCharts :symbol="symbol"></CoinCharts>
          </div>
        </div>
      </div>
      <div class="col news-section">
        <CryptoNews></CryptoNews>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoNews from '../components/CryptoNews.vue'
import CoinCharts from '@/components/CoinCharts.vue'
import { computed, watch } from 'vue'
import { useStore } from '@/stores'
import { useRoute } from 'vue-router'
import { subscribeSymbol } from '@/services/binance'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const { symbol } = defineProps<{ symbol: string }>()

const route = useRoute()
const store = useStore()

const currency = computed(() => {
  return store.getSymbolById(symbol)!
})
const ticker = computed(() => {
  return store.getTickerById(symbol)!
})
const priceformat = (value: string | undefined) => (value ? parseFloat(value).toLocaleString() : '')
const timeformat = (value: number | undefined) => {
  if (value) {
    const dt = new Date(value)
    return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.toTimeString().split(' ')[0]}`
  } else {
    return ''
  }
}
// Watching route param and subscibe to symbol if user directly open InfoView page
watch(
  () => route.params.symbol,
  (sym) => {
    if (!ticker.value) {
      subscribeSymbol(sym as string)
    }
  },
  { immediate: true }
)
</script>
