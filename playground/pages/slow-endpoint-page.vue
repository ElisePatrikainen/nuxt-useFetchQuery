<template>
    <h2>Slow endpoint page</h2>
    <div style="margin-bottom: 1rem; font-style: italic;">A page with a slow endpoint for better testing and debugging.</div>
    <div>Debugging:
        <ul>
            <li>content: {{ date }}</li>
            <li>pending: {{ pending }}</li>
            <li>fetching: TODO</li>
            <li>refreshing: {{ refreshing }}</li>
        </ul>
    </div>
</template>
  
<script setup>
const { data: date, pending, refreshing } = await useFetchQuery(`/api/slow-endpoint`, { refreshTime: 15000 })
</script>
  