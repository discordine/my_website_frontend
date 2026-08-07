<script setup>
const route = useRoute()
const id = route.params.id

const { data: stream } = await useFetch(`/api/streams/${id}`)
</script>

<template>
  <div v-if="stream">
    <h1>{{ stream.title }}</h1>
    <p>{{ stream.category }}</p>
    <p>{{ stream.started_at }} - {{ stream.ended_at }}</p>
  </div>
</template>