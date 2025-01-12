import './assets/app.scss'
import ClickOutside from './directives/ClickOutsideDirective'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.directive('click-outside', ClickOutside)
app.use(createPinia())
app.use(router)

app.mount('#app')
