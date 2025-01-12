<template>
  <div class="layout-container">
    <header class="page-header bg-primary">
      <button
        class="back-btn"
        v-if="currentPage === 'infoview'"
        @click="router.push({ path: '/' })"
      >
        <b class="left-arrow"></b>
      </button>
      <span class="page-title">VUE 3 CRYPTO DASHBOARD</span>
    </header>
    <div class="page-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router'

const currentPage = ref('dashboard')
const router = useRouter()
const route = useRoute()

watch(
  route,
  (to: RouteLocationNormalized) => {
    currentPage.value = to.name as string
  },
  { deep: true }
)
</script>
