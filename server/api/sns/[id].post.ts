export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const body = await readBody(event)

  return await $fetch(`/api/posts`, {
    baseURL: "http://127.0.0.1:8000",
    method: "POST",
    body,
  })
})