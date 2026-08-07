<script setup>
import { ref, watch, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  show: Boolean,
  loading: Boolean,
  stream: Object
})

const emit = defineEmits(['close', 'save', 'delete'])

const editing = ref(false)
const memo = ref('')

const { user, loggedIn } = useUserSession()

const session = useUserSession()

console.log(loggedIn.value, user.value)

watch(
  () => props.stream,
  (newStream) => {
    memo.value = newStream?.memo || ''
    editing.value = false
  },
  { immediate: true }
)

const saveMemo = () => {
  emit('save', {
    id: props.stream.id,
    memo: memo.value.replaceAll("\n", "\n\n")
  })

  editing.value = false
}

const hasMemo = computed(() => {
  return !!props.stream?.memo?.trim()
})

const renderedMemo = computed(() => {
  return marked.parse(props.stream?.memo || '')
})

const deleteStream = () => {
  emit('delete', props.stream.id)
}

const isAdmin = computed(() => {
  return session.user.value?.login==='discordine_slack'
})

const durationText = computed(() => {
  if (!props.stream?.started_at || !props.stream?.ended_at) {
    return ''
  }

  const start = new Date(props.stream.started_at)
  const end = new Date(props.stream.ended_at)

  const diffMs = end - start

  const hours = Math.floor(diffMs / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)

  return `${hours}時間${minutes}分`
})
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div
      class="absolute inset-0 bg-black/50"
      @click="emit('close')"
    />

    <div
      class="relative z-10 w-full max-w-xl rounded-lg bg-white p-6 shadow-lg"
    >
      <button
        class="absolute top-3 right-3"
        @click="emit('close')"
      >
        ✕
      </button>

      <template v-if="loading">
        <div class="py-8 text-center">
          読み込み中...
        </div>
      </template>

      <template v-else-if="stream">
        <h2 class="mb-4 text-2xl font-bold">
          {{ stream.title }}
        </h2>

        <div class="space-y-3">
          <p>
            <strong>カテゴリ:</strong>
            {{ stream.category }}
          </p>

          <p>
            <strong>開始:</strong>
            {{ stream.started_at }}
          </p>

          <p>
            <strong>終了:</strong>
            {{ stream.ended_at }}
          </p>

          <p>
            <strong>配信時間:</strong>
            {{ durationText  }}
          </p>

          <div>
            <div class="mb-2 flex items-center justify-between">
              <strong>メモ</strong>
            </div>

            <template v-if="editing">
              <textarea
                v-model="memo"
                rows="5"
                class="w-full rounded border p-2"
              />

              <div class="mt-2 flex gap-2">
                <button
                  class="rounded bg-green-600 px-4 py-2 text-white"
                  @click="saveMemo"
                >
                  保存
                </button>

                <button
                  class="rounded bg-gray-300 px-4 py-2"
                  @click="editing = false"
                >
                  キャンセル
                </button>
              </div>
            </template>

            <template v-else>
              <div
                v-if="hasMemo"
                class="prose max-w-none rounded border p-4 bg-gray-50"
                v-html="renderedMemo"
              />

              <div
                v-else
                class="italic"
              >
                なし
              </div>
            </template>
            <br>
            <button
                v-if="!editing && isAdmin"
                class="rounded bg-blue-500 px-3 py-1 text-white"
                @click="editing = true"
              >
                編集
            </button>

            <button
                v-if="!editing && isAdmin"
                class="rounded bg-red-500 px-3 py-1 text-white"
                @click="deleteStream"
              >
                削除
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>