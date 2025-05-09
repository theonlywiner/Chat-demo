<template>
  <div class="daily-quote">
    <h2>每日一言</h2>
    <p>{{ quote }}</p>
  </div>
</template>

<script>
export default {
  name: 'DailyQuote',
  data() {
    return {
      quote: '今天也要元气满满哦！' // 默认每日一言
    }
  },
  created() {
    this.fetchQuote()
  },
  methods: {
    fetchQuote() {
      // 这里可以从API获取数据，或者使用静态数据
      // 为了示例，这里使用静态数据
      const quotes = [
        '生活就像海洋，只有意志坚强的人才能到达彼岸。',
        '不积跬步，无以至千里；不积小流，无以成江海。'
        // ... 更多每日一言
      ]
      // 随机选择一条
      this.quote = quotes[Math.floor(Math.random() * quotes.length)]
    }
  }
}
</script>

<style scoped>
.daily-quote {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
