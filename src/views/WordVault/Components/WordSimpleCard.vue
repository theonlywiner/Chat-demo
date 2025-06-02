<template>
  <div class="word-simple-card">
    <div class="word-title">【{{ word }}】</div>
    <div class="meaning-count">共 {{ meanings.length }} 个词义</div>
    <div class="meaning-list">
      <div
        v-for="(item, idx) in meanings"
        :key="idx"
        class="meaning-item"
        @click="handleClick(item)"
      >
        <span class="meaning-type">{{ item.type || '' }}</span>
        <span class="meaning-subtype">{{ item.subtype || '' }}</span>
        <span class="meaning-main">{{ item.meaning || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { word, meanings } = defineProps({
  word: String,
  meanings: Array
})
const emit = defineEmits(['show-detail'])
function handleClick(meaning) {
  emit('show-detail', meaning)
}
</script>

<style scoped>
.word-simple-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 18px 18px 12px 18px;
  width: 480px; /* 控制卡片长度的变量是width */
  max-width: 100%;
  margin-bottom: 10px;
}
.word-title {
  font-size: 22px;
  font-weight: bold;
  color: #b3423a;
  margin-bottom: 8px;
}
.meaning-count {
  font-size: 15px;
  color: #888;
  margin-bottom: 10px;
}
.meaning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.meaning-item {
  font-size: 15px;
  color: #333;
  background: #f7f9fa;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    background 0.2s;
}
.meaning-item:hover {
  box-shadow: 0 4px 16px rgba(30, 144, 255, 0.1);
  background: #eaf6ff;
}
.meaning-type {
  color: #3a6ea5;
  font-weight: bold;
}
.meaning-subtype {
  color: #8c7853;
  margin-left: 4px;
}
.meaning-main {
  margin-left: 8px;
  flex: 1;
}
</style>
