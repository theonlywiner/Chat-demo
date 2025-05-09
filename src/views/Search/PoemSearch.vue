<script setup>
import { ref, onMounted } from 'vue'
import { Search, Remove } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import { usePoemStore } from '@/stores/poem'
import {
  getGradeList,
  getArticleListByGrade,
  getArticleListById
} from '@/api/searchArticle'

const router = useRouter()
const route = useRoute()
const poemStore = usePoemStore()
const total = ref(0)
const searchText = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5) // 设置默认每页显示5条

// 年级相关
const gradeOptions = ref([])
const selectedGrade = ref(0) // 默认选择全部

// 文章列表
const articleList = ref([])

// 获取年级列表
const getGrades = async () => {
  try {
    const res = await getGradeList()
    gradeOptions.value = res
  } catch (error) {
    console.error('获取年级列表失败:', error)
  }
}

// 获取诗歌列表
const getPoems = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      gradeId: selectedGrade.value,
      name: searchText.value || ''
    }

    let res
    if (selectedGrade.value === 0) {
      res = await getArticleListByGrade(params)
    } else {
      res = await getArticleListById(params)
    }

    // 添加处理文本的函数
    const cleanText = (text) => {
      return text
        .replace(/<br\/?>/g, '') // 移除 <br> 或 <br/>
        .replace(/&nbsp;/g, '') // 移除 &nbsp;
        .replace(/\s+/g, '') // 移除多余空格
        .trim() // 移除首尾空格
    }

    articleList.value = res.rows.map((item) => ({
      id: item.id,
      title: item.name,
      author: item.author,
      dynasty: item.dynasty,
      description: cleanText(item.fullAncientContent).slice(0, 15) + '...'
    }))
    total.value = res.total
  } catch (error) {
    console.error('获取诗歌列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  getPoems() // 只在点击搜索按钮时才调用接口
}

// 处理分页
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  getPoems()
}

// 清空搜索
const removesearchText = () => {
  searchText.value = ''
}

// 处理点击诗歌
const handlePoemClick = (id) => {
  // 保存当前状态
  poemStore.savePageState(
    currentPage.value,
    pageSize.value,
    selectedGrade.value,
    searchText.value,
    articleList.value,
    total.value,
    gradeOptions.value
  )

  router.push({
    name: 'poemDetail',
    params: { id },
    query: { page: 'PoemSearch' }
  })
}

// 修改 onMounted
onMounted(async () => {
  // 检查是否是从详情页返回
  const fromDetail = route.query.from === 'detail'
  if (fromDetail && poemStore.getPageState()) {
    // 恢复所有状态
    currentPage.value = poemStore.currentPage
    pageSize.value = poemStore.pageSize
    selectedGrade.value = poemStore.selectedGrade
    searchText.value = poemStore.searchText
    articleList.value = poemStore.articleList
    total.value = poemStore.total
    gradeOptions.value = poemStore.gradeOptions
  } else {
    // 首次加载或缓存过期
    await getGrades()
    getPoems()
  }
})
</script>

<template>
  <div class="article-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="search-box">
        <!-- 年级选择器 - 移除 @change 事件 -->
        <el-select
          v-model="selectedGrade"
          placeholder="选择年级"
          class="grade-selector"
          style="min-height: 40px"
        >
          <el-option
            v-for="item in gradeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <!-- 搜索框 -->
        <el-input
          v-model="searchText"
          placeholder="请输入查找的古诗文名称..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
          <template #suffix>
            <el-icon
              v-if="searchText"
              class="remove-icon"
              @click="removesearchText"
            >
              <Remove />
            </el-icon>
          </template>
        </el-input>

        <!-- 搜索按钮 -->
        <el-button type="primary" class="search-button" @click="handleSearch">
          搜索
        </el-button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list" v-loading="loading">
      <template v-if="articleList.length > 0">
        <ArticleCard
          v-for="article in articleList"
          :key="article.id"
          :article="article"
          @click="handlePoemClick(article.id)"
        />
      </template>
      <el-empty v-else description="暂无数据" />
    </div>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :background="true"
      layout="total, prev, pager, next, jumper"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<style lang="less" scoped>
.article-container {
  max-width: 1300px;
  margin: 0 auto;
}

.search-area {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;

  .search-box {
    width: 100%;
    display: flex;
    gap: 10px;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .grade-selector {
      width: 120px;
    }

    .search-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px #e4e7ed;

        &:hover,
        &:focus {
          box-shadow: 0 0 0 1px var(--el-color-primary);
        }
      }

      .search-icon {
        font-size: 18px;
        color: #909399;
      }

      .remove-icon {
        font-size: 18px;
        color: #909399;
        cursor: pointer;
      }
    }

    .search-button {
      padding: 20px 25px;
      font-size: 16px;
    }
  }
}

.article-list {
  display: grid;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
