export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()

  const title = body?.title

  console.log("NUXT POST HIT")

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: "スレッドタイトルは必須です",
    })
    
  }

  // ここでDB保存（例: Prisma / SQL / Laravel API呼び出しなど）
  const thread = await $fetch("http://127.0.0.1:8000/api/threads", {
    method: "POST",
    body: { title },
  })

  return thread
})