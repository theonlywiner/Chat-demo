<!-- 古诗文展示列表 -->
<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <el-card class="article-card" body-style="padding: 10px 20px">
    <div class="article-content">
      <div class="article-header">
        <h3 class="article-title">{{ article.title }}</h3>
        <span class="article-dynasty">{{ article.dynasty }}</span>
      </div>
      <div class="article-info">
        <span class="article-author">作者：{{ article.author }}</span>
      </div>
      <p class="article-desc">{{ article.description }}</p>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.article-card {
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .article-title {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }

  .article-dynasty {
    color: #909399;
    font-size: 14px;
    padding: 2px 8px;
    background-color: #f0f2f5;
    border-radius: 4px;
  }
}

.article-info {
  margin-bottom: 10px;
  font-size: 14px;
  color: #909399;
}

.article-desc {
  color: #606266;
  margin: 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
