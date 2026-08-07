export default defineEventHandler(async () => {
  console.log("NUXT GET HIT")
  return await $fetch('http://127.0.0.1:8000/api/threads')
})