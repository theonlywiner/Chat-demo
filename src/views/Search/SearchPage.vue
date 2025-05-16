<script setup>
import { ref, onMounted } from 'vue'
import { Search, Remove } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import SimpleWordCloud from '@/components/SimpleWordCloud.vue'
import { useSearchStore } from '@/stores/search'
import { getDynastyList } from '@/api/searchArticle'
import { searchKeyword, getDynastyStatistics } from '@/api/searchKeyword'

const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const total = ref(0)
const searchText = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)

// 朝代相关
const dynastyOptions = ref([])
const selectedDynasty = ref('')

// 文章列表
const articleList = ref([])

// 添加词云相关的状态
const showWordCloud = ref(false)
const dynastyStats = ref([])

// 添加一个响应式变量记录当前词云对应的关键词
const currentCloudKeyword = ref('')

// 获取朝代列表
const getDynasties = async () => {
  try {
    const res = await getDynastyList()

    // 在朝代列表前添加"全部"选项
    dynastyOptions.value = res
    // 默认选择"全部"
    selectedDynasty.value = 0
  } catch (error) {
    console.error('获取朝代列表失败:', error)
  }
}

// 获取文章列表
const getSearchResults = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value || '',
      dynastyId: selectedDynasty.value || ''
    }

    const res = await searchKeyword(params)

    // 处理文本
    const cleanText = (text) => {
      return text
        .replace(/<br\/?>/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/\s+/g, '')
        .trim()
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
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取朝代统计数据
const getDynastyStats = async (keyword = '') => {
  try {
    const res = await getDynastyStatistics(keyword)
    console.log(res)

    dynastyStats.value = res
    currentCloudKeyword.value = keyword // 更新当前词云的关键词
  } catch (error) {
    console.error('获取朝代统计失败:', error)
  }
}

// 显示词云
const handleShowWordCloud = async () => {
  if (dynastyStats.value.length === 0) {
    await getDynastyStats() // 不传参数则使用空关键词
  }
  showWordCloud.value = true
}

// 处理搜索
const handleSearch = async () => {
  currentPage.value = 1
  await getSearchResults()
  // 搜索后更新词云数据,使用新的关键词
  await getDynastyStats(searchText.value)
}

// 处理分页
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  getSearchResults()
}

// 清空搜索
const removesearchText = () => {
  searchText.value = ''
}

// 处理点击诗歌
const handleStoryClick = (id) => {
  searchStore.savePageState(
    currentPage.value,
    pageSize.value,
    selectedDynasty.value,
    searchText.value,
    articleList.value,
    total.value,
    dynastyOptions.value
  )

  router.push({
    name: 'poemDetail', // 修改为 poemDetail
    params: { id },
    query: { page: 'SearchPage' }
  })
}

// 添加词云点击处理方法
const handleWordCloudClick = async (wordData) => {
  // 更新朝代选择
  selectedDynasty.value = wordData.dynastyId
  // 关闭词云对话框
  showWordCloud.value = false
  // 重新搜索
  await getSearchResults()
}

onMounted(async () => {
  const fromDetail = route.query.from === 'detail'
  if (fromDetail && searchStore.getPageState()) {
    currentPage.value = searchStore.currentPage
    pageSize.value = searchStore.pageSize
    selectedDynasty.value = searchStore.selectedDynasty
    searchText.value = searchStore.searchText
    articleList.value = searchStore.articleList
    total.value = searchStore.total
    dynastyOptions.value = searchStore.dynastyOptions
    if (dynastyStats.value.length > 0) {
      currentCloudKeyword.value = searchText.value
    }
  } else {
    // 首次加载:
    // 1. 获取朝代列表
    await getDynasties()
    // 初始加载时获取全部统计数据
    await getDynastyStats()
    await getSearchResults()
  }
})
</script>

<template>
  <div class="article-container">
    <div class="search-area">
      <div class="search-box">
        <!-- 朝代选择器 -->
        <el-select
          v-model="selectedDynasty"
          placeholder="选择朝代"
          class="dynasty-selector"
        >
          <el-option
            v-for="item in dynastyOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <!-- 搜索框 -->
        <el-input
          v-model="searchText"
          placeholder="请输入查找的内容..."
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

        <!-- 词云按钮 -->
        <el-button
          type="primary"
          class="word-cloud-button"
          @click="handleShowWordCloud"
        >
          查看分布
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
          @click="handleStoryClick(article.id)"
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

    <!-- 词云对话框 -->
    <el-dialog
      v-model="showWordCloud"
      width="1000px"
      center
      :fullscreen="false"
      :top="'5vh'"
    >
      <template #header>
        <div class="dialog-header">
          <h3>朝代分布统计</h3>
          <div class="keyword-info">
            当前查询关键词:
            {{ currentCloudKeyword ? `"${currentCloudKeyword}"` : '全部' }}
          </div>
        </div>
      </template>

      <SimpleWordCloud
        v-if="dynastyStats.length > 0"
        :word-list="dynastyStats"
        :options="{
          sizeRange: [24, 100],
          rotationRange: [-45, 45],
          shape: 'circle'
        }"
        @word-click="handleWordCloudClick"
      />
      <el-empty v-else description="暂无分布数据" />
    </el-dialog>
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

    .dynasty-selector {
      width: 120px;

      :deep(.el-input__wrapper) {
        height: 40px;
        line-height: 40px;
      }
    }

    .search-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        height: 40px;
        line-height: 40px;
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
      height: 40px;
      padding: 0 25px;
      font-size: 16px;
    }

    .word-cloud-button {
      height: 40px;
      padding: 0 15px;
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

:deep(.el-dialog__body) {
  padding: 30px;
  min-height: 600px;
}

:deep(.el-dialog) {
  margin-top: 5vh !important;
}

:deep(.el-dialog__header) {
  padding: 20px 30px;
  margin-right: 0;
  border-bottom: 1px solid #dcdfe6;
}

.dialog-header {
  h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }

  .keyword-info {
    margin-top: 8px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
