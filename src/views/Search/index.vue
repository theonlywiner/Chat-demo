<script setup>
import { ref, onMounted } from 'vue'
import { Search, Remove } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import { useArticleStore } from '@/stores/searchArticle'
import { getArticleList, searchArticle } from '@/api/searchArticle'

const router = useRouter()
const route = useRoute()
const articleStore = useArticleStore() //用于缓存列表
const total = ref(13) // 总条数
const searchText = ref('') // 搜索内容
const loading = ref(false)
const currentPage = ref(1) //当前页
const pageSize = ref(5) //每页条数
const isSearch = ref(false) //是否搜索
// 记录分页信息
const pageInfo = ref({
  startIndex: 0, // 当前页开始的索引
  endIndex: 5 // 当前页结束的索引
})
// 数组保存列表
const articleList = ref([])
const articleListall = ref([])

//获取当前页面的文章列表
const get_Articles = async () => {
  loading.value = true

  // 这里可以调用后端API获取数据  当前页的list  总条数
  const res = await getArticleList(pageInfo.value)

  // articleList
  articleList.value = res.list
  total.value = res.total

  loading.value = false
}

// 处理分页变化
const handlePageChange = (newPage) => {
  pageInfo.value = {
    startIndex: (newPage - 1) * pageSize.value,
    endIndex:
      newPage * pageSize.value < total.value
        ? newPage * pageSize.value
        : total.value,
    totalItems: total.value
  }
  currentPage.value = newPage
  if (isSearch.value) {
    articleList.value = articleListall.value.slice(
      pageInfo.value.startIndex,
      pageInfo.value.endIndex
    )
  } else {
    // 这里可以调用后端API获取数据
    get_Articles(pageInfo.value.startIndex, pageInfo.value.endIndex)
  }
}

// 处理文章点击
const handleArticleClick = (id) => {
  // 保存当前页面状态
  articleStore.savePageState(
    currentPage.value,
    articleList.value,
    total.value,
    isSearch.value,
    searchText.value,
    articleListall.value
  )
  router.push({
    name: 'prodetail',
    params: { id: id },
    query: { page: 'Search' }
  })
}

// 处理搜索
const handleSearch = async () => {
  loading.value = true
  isSearch.value = true
  if (searchText.value) {
    // 调用后端API搜索文章
    const res = await searchArticle(searchText.value)

    // 更新文章列表和总数
    articleListall.value = res.list
    total.value = res.total

    // 重置分页相关状态
    currentPage.value = 1 // 重置到第一页
    pageInfo.value = {
      startIndex: 0,
      endIndex: pageSize.value
    }

    articleList.value = articleListall.value.slice(
      pageInfo.value.startIndex,
      pageInfo.value.endIndex
    )
    // 清除缓存状态，因为这是新的搜索结果
    articleStore.clearPageState()
  } else {
    // 如果搜索框为空，恢复到初始列表状态
    isSearch.value = false
    pageInfo.value = {
      startIndex: 0,
      endIndex: pageSize.value
    }
    currentPage.value = 1
    get_Articles()
  }
  loading.value = false
}

//一键清空搜索内容
const removesearchText = () => {
  searchText.value = ''
}

onMounted(() => {
  // 检查是否是从详情页返回
  const fromDetail = route.query.from === 'detail'
  if (fromDetail && articleStore.getPageState()) {
    // console.log(111)

    // 如果是从详情页返回且有缓存，使用缓存数据
    currentPage.value = articleStore.currentPage
    articleList.value = articleStore.articleList
    total.value = articleStore.total
    isSearch.value = articleStore.isSeachs
    searchText.value = articleStore.searchTexts
    articleListall.value = articleStore.articleListalls
  } else {
    // 否则获取第一页数据
    get_Articles(pageInfo.value.startIndex, pageInfo.value.endIndex)
  }
})
</script>

<template>
  <div class="article-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="search-box">
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
              class="remove-icon"
              v-if="searchText"
              @click="removesearchText()"
              ><Remove
            /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" class="search-button" @click="handleSearch"
          >搜索</el-button
        >
      </div>
    </div>

    <!-- 文章列表区域 -->
    <div class="article-list" v-loading="loading">
      <template v-if="articleList.length > 0">
        <ArticleCard
          v-for="article in articleList"
          :key="article.id"
          :article="article"
          @click="handleArticleClick(article.id)"
        />
      </template>
      <el-empty v-else description="暂无数据" />
    </div>

    <!-- 分页 -->
    <!-- 1.current-page 当前页 -->
    <!-- 2.page-size 每页多少条 -->
    <!-- 3.page-sizes 可供选择的列表项 表示每页多少条 -->
    <!-- 4.background 添加背景颜色 当前选择的页面会变蓝色 -->
    <!-- 5.layout 布局  total总条数 sizes每页多少条 prev上箭头 pager页码 next下箭头 jumper跳转页面 -->
    <!-- 6.size-change 总条数改变触发 -->
    <!-- 7.current-change 页码改变触发 -->
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
    width: 100%; // 修改为100%以适应容器宽度
    display: flex;
    gap: 10px;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .search-input {
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

:deep(.el-empty) {
  padding: 40px 0;
}
</style>
