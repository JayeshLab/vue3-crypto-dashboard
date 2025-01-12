# Vue 3 Crypto Dashboard

A Cryptocurrency Dashboard build with Vue 3 in Vite, PWA enabled, Binance Websocket API for realtime price, amChart5 for displaying historical charts, SVG Sparkline Chart and Latest News feed from Cryptocompare site.

Demo: [https://jayeshlab.github.io/vue3-crypto-dashboard/](https://jayeshlab.github.io/vue3-crypto-dashboard/)

<img width="500" alt="portfolio_view" src="https://user-images.githubusercontent.com/36194663/47360119-2ec3a600-d6ec-11e8-95a2-0b61d0bf0f11.png">

<img width="500" alt="portfolio_view" src="https://user-images.githubusercontent.com/36194663/47360137-3edb8580-d6ec-11e8-8cb9-88b632328e38.png">
 
## Tech Stacks

- [Vite](https://vite.dev/)
- [Vue 3](https://vuejs.org/guide/introduction.html)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Sass](http://sass-lang.com/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Binance Websocket Stream](https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md)
- [amcharts5](https://www.amcharts.com/)
- [Cryptocompare News Api](https://min-api.cryptocompare.com/)
- [Custom Sparkline chart](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/master/src/components/Sparkline.vue)
- [Custom Searchable Dropdown](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/master/src/components/SearchableDropdown.vue)
- [Custom Binance Websocket Api](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/master/src/services/api.js)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
