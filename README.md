# Vue JS 3 Crypto Dashboard

A Cryptocurrency Dashboard build with Vue JS 3 Typescript in Vite, PWA enabled, Binance Websocket API for realtime price, amChart5 for displaying historical charts, SVG Sparkline Chart and Latest News feed from Cryptocompare site.

Demo: [https://vue3-crypto-dashboard.vercel.app/](https://vue3-crypto-dashboard.vercel.app/)


![vd1](https://github.com/user-attachments/assets/9410a4f7-c263-40b2-8936-bfb801b67c84)

![vd2](https://github.com/user-attachments/assets/1832fa0c-9830-48b1-8267-ddf3080ad20a)


 
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
- [Custom Sparkline chart](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/main/src/components/SparkLine.vue)
- [Custom Searchable Dropdown](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/main/src/components/SearchableDropdown.vue)
- [Custom Binance Websocket Api](https://github.com/JayeshLab/vue3-crypto-dashboard/blob/main/src/services/api.ts)

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
