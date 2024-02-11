<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: UseFetchQuery
- Package name: nuxt-usefetchquery
- Description: A Nuxt module to help caching, synchronizing and updating server state.
-->

# UseFetchQuery

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

🚧🚧 ***UseFetchQuery is currently a draft for testing a module idea, it is therefore absolutely not usable.***

UseFetchQuery is a Nuxt module providing composables to help caching, synchronizing and updating server state in our applications. It is largely inspired by [TanstackQuery](https://tanstack.com/query/latest) and [SWR](https://swr.vercel.app/), and aims to build the essential functionalities of these libraries on the top of `useFetch` and `useAsyncData`.

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md) -->
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-usefetchquery?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

The goal of UseFetchQuery is to provide essential server state management functionalities, such as:
- caching out of the box the data fetch from the server
- setting a life time to our cache (and refreshing the data when the cache is expired)
- refreshing data on window events (focus, reconnection)
- exposing a `fetching` and `refreshing` state to know if the data is being fetch/refreshed
- [TODO] handling pagination cache

## Caching and refreshing

By default, the only cache parameter set is deduping the requests. Nevertheless, you can easily set a cache lifetime to your requests by passing a number (ms) to the `refreshTime` option, which will cache the data and refresh them once they are stale:

```js
const { data, error } = await useFetchQuery(`/api/products`, { refreshTime: 15000 })
// The data will be cached for 15 seconds, and refreshed afterwards
```

Nb: UseFetchQuery does currently not poll data (TODO ?), but re-fetches them in the background once they are stale on the following events:
- new instances of the composable mount
- window events: refocus, reconnection

You can also choose to never revalidate cache, by setting the `refreshTime` option to `infinite`:

```js
const { data, error } = await useFetchQuery(`/api/products`, { refreshTime: 'infinite' })
```

## Refreshing state

By default, refreshing is done on the background. This means that:
- useFetchQuery will first display the stale data, and update them once they are revalidated
- if you use `Suspense`, it will be effective only on the first call, when no data has been fetched yet, and will be disabled on refresh

If you need to display the fetching (on the initial call) or refreshing state, `useFetchQuery` exposes:
- [TODO] a `fetching` ref, which will be set to `true` when the data is being initially fetched
- a `refreshing` ref, which will be set to `true` when the data is being revalidated

```js
const { data, fetching, refreshing } = await useFetchQuery(`/api/products`, { refreshTime: 15000 })
// `fetching` can be used to display a full page loader (skeleton, etc) when there is no data 
// `refreshing` can be used to display a smaller loader on revalidation, which would not prevent displaying the stale data meanwhile
```
In case you still want `suspense` to be effective while refreshing, you can set the `suspense` option to `true`:

```js
const { data, error } = await useFetchQuery(`/api/products`, { suspenseOnRefresh: true })
```

Nb: `useFetchQuery` still exposes the `pending` and `status` refs returned by `useFetch`, without altering their behaviour. Therefore, when the data is being fetched or revalidated:
- `pending` which will be set to `true`
- `status` which will be set to `pending`

## Refresh on window events

By default, the data will be revalidated (in the background) on the following events:
- window refocus
- network reconnection

You can disable this behaviour by setting the `refreshOnFocus` and `refreshOnReconnection` options to `false`:

```js
const { data, error } = await useFetchQuery(`/api/products`, { refreshOnFocus: false, refreshOnReconnection: false})
```

## Pagination

TODO 🙃

## Global parameters

TODO 🙃

## Quick Setup

1. Add `nuxt-usefetchquery` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-usefetchquery

# Using yarn
yarn add --dev nuxt-usefetchquery

# Using npm
npm install --save-dev nuxt-usefetchquery
```

2. Add `nuxt-usefetchquery` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-usefetchquery'
  ]
})
```

That's it! You can now use UseFetchQuery in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-usefetchquery/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-usefetchquery

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-usefetchquery.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-usefetchquery

[license-src]: https://img.shields.io/npm/l/nuxt-usefetchquery.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-usefetchquery

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
