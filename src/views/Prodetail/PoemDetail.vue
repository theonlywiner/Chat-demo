<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPoemDetail, getRelatedPoems } from '@/api/searchArticle'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const poemDetail = ref({
  id: '',
  name: '',
  dynasty: '',
  author: '',
  fullAncientContent: '',
  fullModernContent: '',
  annotation: '',
  appreciation: '',
  background: '',
  peopleAppreciation: '',
  links: []
})

// 相关古诗列表
const relatedPoems = ref([])

// 获取相关古诗
const getRelatedPoemsList = async (ids) => {
  try {
    const res = await getRelatedPoems(ids)
    relatedPoems.value = res
  } catch (error) {
    console.error('获取相关古诗失败:', error)
  }
}

// 添加文本处理函数
const formatContent = (text) => {
  if (!text) return ''
  return text
    .replace(/<br\/?>/g, '\n') // 将 <br> 或 <br/> 转换为换行符
    .replace(/&nbsp;/g, ' ') // 将 &nbsp; 转换为空格
    .replace(/\s+$/, '') // 移除末尾多余的空白字符
    .trim() // 移除首尾空格
}

// 获取诗歌详情
const getPoemData = async (id) => {
  loading.value = true
  try {
    const res = await getPoemDetail(id)
    // 处理返回的数据
    poemDetail.value = {
      ...res,
      fullAncientContent: formatContent(res.fullAncientContent),
      fullModernContent: formatContent(res.fullModernContent),
      annotation: formatContent(res.annotation),
      appreciation: formatContent(res.appreciation),
      background: formatContent(res.background),
      peopleAppreciation: formatContent(res.peopleAppreciation)
    }

    // 如果有关联诗歌，获取相关诗歌信息
    if (res.links && res.links.length > 0) {
      await getRelatedPoemsList(res.links)
    }
  } catch (error) {
    console.error('获取诗歌详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理点击相关诗歌
const handleRelatedPoemClick = (id) => {
  router.push({
    name: 'poemDetail',
    params: { id },
    query: { page: route.query.page }
  })
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getPoemData(newId)
    }
  }
)

// 返回按钮处理
const handleBack = () => {
  if (route.query.page === 'SearchPage') {
    router.push({
      path: '/article/search_keyword', // 修改为正确的搜索页面路径
      query: { from: 'detail' }
    })
  } else if (route.query.page === 'PoemSearch') {
    router.push({
      path: '/article/PoemSearch',
      query: { from: 'detail' }
    })
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    getPoemData(id)
  }
})
</script>

<template>
  <div class="detail-container" v-loading="loading">
    <!-- 返回按钮 -->
    <div class="top-bar">
      <div class="back-button" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="poem-detail">
        <!-- 诗歌标题和作者信息 -->
        <div class="detail-header">
          <h1 class="title">{{ poemDetail.name }}</h1>
          <div class="meta">
            <span class="dynasty">{{ poemDetail.dynasty }}</span>
            <span class="author">{{ poemDetail.author }}</span>
          </div>
        </div>

        <el-divider />

        <!-- 诗歌内容 -->
        <div class="content-section">
          <div class="section">
            <h3>原文</h3>
            <div class="text text-ancient" style="white-space: pre-line">
              {{ poemDetail.fullAncientContent }}
            </div>
          </div>

          <div class="section" v-if="poemDetail.fullModernContent">
            <h3>译文</h3>
            <div class="text text-modern" style="white-space: pre-line">
              {{ poemDetail.fullModernContent }}
            </div>
          </div>

          <div class="section" v-if="poemDetail.annotation">
            <h3>注释</h3>
            <div class="text" style="white-space: pre-line">
              {{ poemDetail.annotation }}
            </div>
          </div>

          <div class="section" v-if="poemDetail.appreciation">
            <h3>赏析</h3>
            <div class="text" style="white-space: pre-line">
              {{ poemDetail.appreciation }}
            </div>
          </div>

          <div class="section" v-if="poemDetail.background">
            <h3>创作背景</h3>
            <div class="text" style="white-space: pre-line">
              {{ poemDetail.background }}
            </div>
          </div>

          <div class="section" v-if="poemDetail.peopleAppreciation">
            <h3>网友评价</h3>
            <div class="text" style="white-space: pre-line">
              {{ poemDetail.peopleAppreciation }}
            </div>
          </div>

          <!-- 相关古诗 -->
          <div class="section" v-if="relatedPoems.length > 0">
            <h3>相关古诗</h3>
            <div class="related-poems">
              <el-link
                v-for="poem in relatedPoems"
                :key="poem.id"
                type="primary"
                :underline="true"
                @click="handleRelatedPoemClick(poem.id)"
              >
                {{ poem.name }}
              </el-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  margin-top: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #909399;

  &:hover {
    color: var(--el-color-primary);
  }
}

.poem-detail {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .detail-header {
    text-align: center;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      color: #303133;
      margin-bottom: 10px;
    }

    .meta {
      color: #909399;
      font-size: 14px;

      .dynasty,
      .author {
        margin: 0 10px;
      }
    }
  }

  .content-section {
    .section {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        color: #303133;
        margin-bottom: 15px;
        padding-left: 10px;
        border-left: 4px solid var(--el-color-primary);
      }

      .text {
        line-height: 1.8;
        text-align: justify;
        padding: 0 20px;
      }

      .text-ancient {
        font-size: 18px;
        color: #303133;
        text-align: center; // 原文居中显示
      }

      .text-modern {
        color: #606266;
      }
    }
  }
}

.related-poems {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;

  .el-link {
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
