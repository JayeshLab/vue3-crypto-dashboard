<template>
  <section class="news">
    <header class="news-header">Latest News</header>
    <div class="news-block">
      <div class="news-item" v-for="article in news" :key="article.id">
        <div class="thumb-img">
          <a :href="article.url" target="_blank">
            <img :src="article.imageurl" />
          </a>
        </div>
        <div>
          <h6 class="news-title">
            <a :href="article.url" target="_blank">{{ article.title }}</a>
          </h6>
          <p v-html="truncateText(article.body)"></p>
          <div class="news-data">
            <div class="news-source">{{ article.source_info.name }}</div>
            <div class="news-date">{{ time_since(article.published_on) }}</div>
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
  id: string
  url: string
  imageurl: string
  title: string
  body: string
  source_info: { name: string }
  published_on: number
}
const news = ref<Article[]>([])
let interval: ReturnType<typeof setInterval> | undefined = undefined

const getNews = async () => {
  // Load the latest news using cryptocompare api
  let response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
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
