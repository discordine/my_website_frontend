<script setup lang="ts">
const { data: threads, error, pending } = await useFetch('/api/sns/threads')

const name = ref("")
const errorMessage = ref("")
const isSubmitting = ref(false)

const submit = async () => {
  errorMessage.value = ""
  isSubmitting.value = true

  try {
    const thread = await $fetch<{ id: number }>("/api/sns/threads", {
      method: "POST",
      body: {
        title: name.value,
      },
    })

    await navigateTo(`/sns/${thread.id}`)

  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage ?? "エラーが発生しました"
  }
}

const history = ref<Record<string, string>>({})

const isFirstVisit = ref(false) 

onMounted(() => {
  const threadHistory = localStorage.getItem("threadHistory")

  isFirstVisit.value = !threadHistory;

  history.value = JSON.parse(
    localStorage.getItem("threadHistory") ?? "{}"
  )
})

const threadsWithNew = computed(() => {
  if (!threads.value) return []

  return [...threads.value]
    .map(thread => ({
      ...thread,
      isNew:
        !history.value[thread.id] ||
        new Date(thread.updated_at) > new Date(history.value[thread.id])
    }))
    .sort((a, b) => {
      if (a.isNew !== b.isNew) {
        return a.isNew ? -1 : 1
      }

      return new Date(b.updated_at).getTime()
        - new Date(a.updated_at).getTime()
    })
})

</script>

<template>
  <title>掲示板</title>
  <div class="container">
    <h1>掲示板</h1>
    <div>
    <h2>スレッド一覧</h2>

    <div v-if="pending" class="status">
    読み込み中...
    </div>

    <div v-else-if="error" class="status">
    取得に失敗しました。
    </div>

    <div v-else-if="threadsWithNew.length === 0" class="status">
    スレッドがありません。
    </div>

    <div v-else class="thread-list">
    <div v-for="thread in threadsWithNew" :key="thread.id" class="thread-item">
        <p>
        <router-link :to="`/sns/${thread.id}`">
            {{ thread.title }}
        </router-link>
        <span v-if="!isFirstVisit">
          <small v-if="thread.isNew" class="text-red-600">（新着）</small>
        </span>
        </p>
        <small>最終更新: {{ new Date(thread.updated_at).toLocaleString('ja-JP') }}</small>
    </div>
    </div>
  </div>  
    <div class="form">
    <h2>新規スレッド作成</h2>

    <input v-model="name" placeholder="スレッドの名前" />
    <div v-if="errorMessage" class="text-red-600">
      {{ errorMessage }}
    </div>

    <button @click="submit"
    :disabled="isSubmitting">作成</button>
    </div>
  </div>
</template>

<style scoped>
/* 全体中央寄せ */
div {
  font-family: system-ui, sans-serif;
}

/* スレッド一覧のコンテナ */
.thread-list {
  max-width: 600px;
  margin: 30px auto;
  padding: 0 16px;
}

/* 各スレッドカード */
.thread-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 10px;
  transition: 0.2s;
}

.thread-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* リンク */
.thread-item a {
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;
}

.thread-item a:hover {
  text-decoration: underline;
}

/* ローディング・エラー */
.status {
  text-align: center;
  margin-top: 40px;
  color: #6b7280;
}

/* 新規作成エリア */
.form {
  max-width: 600px;
  margin: 40px auto;
  border-top: 1px solid #e5e7eb;
}

/* 入力 */
input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ボタン */
button {
  margin-top: 10px;
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

/* メインタイトル */
h1 {
  max-width: 600px;
  margin: 40px auto 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid #2563eb;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* セクションタイトル */
h2 {
  max-width: 600px;
  margin: 24px auto 16px;
  color: #374151;
  font-size: 1.3rem;
  font-weight: 600;
  padding-left: 12px;
  border-left: 5px solid #2563eb;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>