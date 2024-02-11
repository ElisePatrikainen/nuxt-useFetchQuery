<template>
    <h2>Items:</h2>
    <div>Debugging:
        <ul>
            <li>pending: {{ pending }}</li>
            <li>fetching: TODO</li>
            <li>refreshing: {{ refreshing }}</li>
        </ul>
    </div>
    <section>
        <template v-if="error">Error</template>
        <template v-else>
            <div v-for="item in data">
                <NuxtLink :to="`item/${item.id}`">
                    {{ item.title }}
                </NuxtLink>
            </div>
        </template>
    </section>
</template>
  
<script setup>
const { data, error, pending, refreshing } = await useFetchQuery(`https://fakestoreapi.com/products`, { refreshTime: 15000 })
</script>
  