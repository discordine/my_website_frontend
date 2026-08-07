<script setup>
const { data } = await useFetch("/api/counter", {
  method: "POST"
})

const counter = computed(() =>
  String(data.value?.count ?? 0).padStart(7, "0")
)
</script>

<template>
  <div class="container">
    <title>Slackさんのほーむぺーじ</title>
    <h1>Slackさんのほーむぺーじ</h1>

    <hr>

    <ul>
      <li><a href="/calendar">配信カレンダー</a></li>
      <li><a href="/sns/threads">掲示板</a></li>
      <li><a href="https://dnevnik-slacka.blogspot.com">日記(外部サイト)</a></li>
    </ul>

    <hr>

    <p>
      あなたは
      <span class="counter">{{ counter }}</span>
      人目のお客様です
    </p>
  </div>
</template>

<style scoped>
body {
  background: #c0c0c0;
}

.container {
  width: 700px;
  margin: 30px auto;
  padding: 20px;
  background: white;
  border: 4px ridge #ccc;
  font-family:
    "MS PGothic",
    "ＭＳ Ｐゴシック",
    sans-serif;
  color: black;
}

h1 {
  color: navy;
  text-align: center;
  font-size: 32px;
}

a {
  color: blue;
  text-decoration: underline;
}

a:visited {
  color: purple;
}

a:hover {
  color: red;
}

ul {
  line-height: 2;
}

hr {
  border: 1px inset #ccc;
}

small {
  display: block;
  text-align: center;
}
</style>