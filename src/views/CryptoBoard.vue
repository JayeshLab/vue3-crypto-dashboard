<template>
  <div class="board">
    <div class="card-block" v-for="curr in store.currencies" :key="curr.symbol">
      <CurrencyCard :pair="curr.symbol" :info="curr"></CurrencyCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import CurrencyCard from '../components/CurrencyCard.vue'
import { useStore } from '@/stores'
const store = useStore()
</script>
