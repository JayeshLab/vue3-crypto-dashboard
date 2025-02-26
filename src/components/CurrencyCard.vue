<template>
  <div class="coin-box" @dblclick.stop="openMenu">
    <div class="row g-0 coin-info">
      <div class="col-7">
        <div class="font-weight-bold">{{ info.name }}</div>
        <div class="row g-0 mt-1">
          <div class="col-4 box-icon">
            <span :style="{ backgroundImage: 'url(' + iconurl + ')' }"></span>
          </div>
          <div class="col-8 text-left">
            <div>
              <b>{{ info.base }}</b
              >/{{ info.quote }}
            </div>
            <div class="coin-price" v-if="ticker?.price">
              {{ ticker.price || ''
              }}<span style="font-size: x-small; font-weight: 700; padding-left: 3px">{{
                info.quote
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="[
          ticker?.percent && parseFloat(ticker.percent) < 0 ? 'down' : 'up',
          'col-5',
          'text-right'
        ]"
        v-if="ticker?.price"
      >
        <div class="coin-per">
          <div class="indicator"></div>
          <span>{{ ticker.percent }}%</span>
        </div>
        <div class="coin-chg">
          {{ ticker.chg ? parseFloat(ticker.chg).toFixed(info.quote === 'USDT' ? 3 : 8) : '' }}
        </div>
        <div class="text-dark">
          <span class="text-secondary">Vol:</span> <span>{{ ticker.vol }}</span>
        </div>
      </div>
    </div>
    <div class="dd-container" :class="[{ show: showMenu }]" v-click-outside="closeMenu">
      <span role="button" class="menu-btn" @click.stop="onMenu">
        <span class="ellipsis" aria-hidden="true"></span>
      </span>
      <div class="dd-menu" v-if="showMenu">
        <span class="dd-item" @click="openMenu">Open</span>
        <span class="dd-item" @click="removeCard">Delete</span>
      </div>
    </div>
    <div class="sparkline-chart" v-if="ticker?.price">
      <SparkLine 
        :cdata="ticker.price" 
        :width="380" 
        :height="90"
        :line-color="ticker.percent && parseFloat(ticker.percent) < 0 ? '#ff4444' : '#00c853'"
      ></SparkLine>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import SparkLine from './SparkLine.vue'
import { unSubscribeSymbol } from '../services/binance'
import type { SparklineProps } from '@/types'
import { useStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()

const { pair, info } = defineProps<SparklineProps>()
const store = useStore()
const showMenu = ref(false)

const iconurl = computed(() => `https://www.cryptocompare.com${info.img}`)
const onMenu = () => {
  showMenu.value = true
}
// Remove currency card
const removeCard = () => {
  showMenu.value = false
  unSubscribeSymbol(info.symbol)
  store.removeCoinPair(info.symbol)
}
// Open Menu
const openMenu = () => {
  showMenu.value = false
  router.push({ name: 'infoview', params: { symbol: info.symbol } })
}
// Close Menu
const closeMenu = () => {
  showMenu.value = false
}
const ticker = computed(() => store.getTickerById(pair))
</script>
