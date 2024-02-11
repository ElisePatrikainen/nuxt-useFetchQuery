<script setup>
const { params } = useRoute()
const { data, error, pending, refreshing } = await useFetchQuery(`https://fakestoreapi.com/products/${params.id}`, { refreshTime: 15000 })
</script>

<template>
    <h2>Item details:</h2>
    <div>Debugging:
        <ul>
            <li>pending: {{ pending }}</li>
            <li>fetching: TODO</li>
            <li>refreshing: {{ refreshing }}</li>
        </ul>
    </div>
    <section>
        <div v-if="error">Error</div>
        <div v-else>
            <pre>{{ data }}</pre>
        </div>
    </section>
</template>