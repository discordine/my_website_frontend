<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const {
  data: thread,
  pending,
  error
} = await useFetch(`/api/sns/${id}`)

console.log(thread.value)

const name = ref("")
const body = ref("")

const submit = async () => {
  await $fetch(`/api/sns/${id}`, {
    method: "POST",
    body: {
      thread_id: route.params.id,
      name: name.value,
      body: body.value,
    },
  })

  await refreshNuxtData()

  name.value = ""
  body.value = ""
}

onMounted(() => {
  const threadId = route.params.id as string

  const history = JSON.parse(
    localStorage.getItem("threadHistory") ?? "{}"
  )

  history[threadId] = new Date().toISOString()

  localStorage.setItem(
    "threadHistory",
    JSON.stringify(history)
  )
})

const urlRegex = /(https?:\/\/[^\s]+)/

function splitBody(text) {
  return text.split(urlRegex)
}

function isUrl(text) {
  return urlRegex.test(text)
}

</script>

<template>
  <title>{{ thread.title }}</title>
  <div v-if="pending">
    読み込み中...
  </div>

  <div v-else-if="error">
    エラーが発生しました。
  </div>

  <div v-else-if="thread" class="container">
    <h1>{{ thread.title }}</h1>

    <h2>投稿一覧</h2>

  <div
    v-for="post in thread.posts"
    :key="post.id"
    class="post"
  >
    <small>{{ post.name ?? '名無しさん' }}: </small>

    <p>
      <template v-for="(part, index) in splitBody(post.body)" :key="index">
        <a
          v-if="isUrl(part)"
          :href="part"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ part }}
        </a>
        <template v-else>{{ part }}</template>
      </template>
    </p>

    <small>{{ new Date(post.created_at).toLocaleString('ja-JP') }}</small>
  </div>

    <div>
      <NuxtLink to="/sns/threads">戻る</NuxtLink>
    </div>

    <h2>新規投稿</h2>
    <div>
        <input v-model="name" placeholder="名前" />
        <textarea v-model="body" placeholder="本文" />
    </div>
    <button @click="submit">投稿</button>

  </div>
</template>

<style scoped>
/* 全体 */
.container {
  max-width: 700px;
  margin: 30px auto;
  padding: 0 16px;
  font-family: system-ui, sans-serif;
}

/* タイトル */
h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #374151;
  border-left: 4px solid #2563eb;
  padding-left: 0.6rem;
}

/* 投稿カード */
.post {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
  transition: 0.2s;
}

.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 投稿本文 */
.post p {
  margin: 6px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #111827;
}

/* 名前・日時 */
.post small {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
}

/* 戻るリンク */
a {
  display: inline-block;
  margin-top: 10px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

/* フォーム */
.form {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: 0.2s;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ボタン */
button {
  padding: 10px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

button:hover {
  background: #1d4ed8;
}

.post p {
  margin: 6px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #111827;
  white-space: pre-wrap;
}
</style>