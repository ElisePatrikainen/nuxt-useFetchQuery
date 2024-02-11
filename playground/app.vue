<template>
  <NuxtLoadingIndicator />
  <nav>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/slow-endpoint-page" style="margin-left: 2rem;">Slow endpoint page</NuxtLink>
  </nav>
  <h1>
    Nuxt module playground!
  </h1>
  <NuxtPage />
</template>
