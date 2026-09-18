<template>
  <section class="news">
    <header class="news-header">Latest News</header>
    <div class="news-block">
      <div class="news-item" v-for="article in news" :key="article.ID">
        <div class="thumb-img">
          <a :href="article.URL" target="_blank">
            <img :src="article.IMAGE_URL" />
          </a>
        </div>
        <div>
          <h6 class="news-title">
            <a :href="article.URL" target="_blank">{{ article.TITLE }}</a>
          </h6>
          <p v-html="truncateText(article.BODY)"></p>
          <div class="news-data">
            <div class="news-source">{{ article.SOURCE_DATA.NAME }}</div>
            <div class="news-date">{{ time_since(article.PUBLISHED_ON) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ago } from '../util/Utility'
interface Article {
  ID: string
  URL: string
  IMAGE_URL: string
  TITLE: string
  BODY: string
  SOURCE_DATA: { NAME: string }
  PUBLISHED_ON: number
}
const news = ref<Article[]>([])
let interval: ReturnType<typeof setInterval> | undefined = undefined

const getNews = async () => {
  // Load the latest news using cryptocompare api
  const apiKey = import.meta.env.VITE_COINDESK_API_KEY
  let response = await fetch(`https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=20&api_key=${apiKey}`)
  if (response.ok) {
    let json = await response.json()
    news.value = json['Data']
  }
}
// Text trunction
const truncateText = (value: string) => {
  if (value.length > 135) {
    const substr = value.substring(0, 135)
    return substr.substring(0, substr.lastIndexOf(' ')) + ' ...'
  } else {
    return value
  }
}
// Time since calculation
const time_since = (val: number) => {
  if (val) {
    return ago(val)
  } else {
    return ''
  }
}

onMounted(() => {
  getNews()
  // Get the news every 2min
  interval = setInterval(() => {
    getNews()
  }, 120000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
