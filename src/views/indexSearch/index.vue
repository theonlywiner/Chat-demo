<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Search, Remove } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'
import { useArticleStore } from '@/stores/searchArticle'
import { getArticleList, searchArticle, getGradeList, getArticleListByGrade, getArticleListById } from '@/api/searchArticle'

const router = useRouter()
const route = useRoute()
const articleStore = useArticleStore() //用于缓存列表

// 使用 store 中的状态
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

// 年级相关
const gradeOptions = ref([])
const selectedGrade = ref(0) // 默认选择全部

// 新增：类型和朝代筛选标签
const selectedType = ref('poem')
const selectedDynasty = ref('all')
const typeOptions = [
  { label: '古诗', value: 'poem' },
  { label: '古文', value: 'prose' }
]
const dynastyOptions = [
  { label: '全部(开发中)', value: 'all' },
  { label: '先秦', value: '7' },
  { label: '两汉', value: '5' },
  { label: '魏晋', value: '6' },
  { label: '南北朝', value: '9' },
  { label: '隋代', value: '11' },
  { label: '唐代', value: '2' },
  { label: '五代', value: '4' },
  { label: '宋代', value: '3' },
  { label: '辽朝', value: '15' },
  { label: '金朝', value: '12' },
  { label: '元代', value: '8' },
  { label: '明代', value: '10' },
  { label: '清代', value: '1' },
  { label: '近现代', value: '13' },
  { label: '未知', value: '14' }
]

// 数组保存文章列表
const articleList = ref([])
const articleListall = ref([])

// 获取年级列表
const getGrades = async () => {
  try {
    const res = await getGradeList()
    gradeOptions.value = res
  } catch (error) {
    console.error('获取年级列表失败:', error)
  }
}

// 获取诗歌列表（类似PoemSearch.vue的实现）
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

//获取当前页面的文章列表
const get_Articles = async () => {
  loading.value = true

  try {
    // 构建请求参数
    const params = {
      startIndex: pageInfo.value.startIndex,
      endIndex: pageInfo.value.endIndex,
      type: selectedType.value, // 添加类型参数
      dynastyId: selectedDynasty.value !== 'all' ? selectedDynasty.value : undefined // 添加朝代ID参数
    }

    // 这里可以调用后端API获取数据  当前页的list  总条数
    const res = await getArticleList(params)

    // articleList
    articleList.value = res.rows
    total.value = res.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
    articleList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}



// 处理类型切换
const handleTypeChange = async () => {
  // 重置搜索状态
  isSearch.value = false
  searchText.value = ''
  currentPage.value = 1
  pageInfo.value = {
    startIndex: 0,
    endIndex: pageSize.value
  }
  
  // 如果是古诗类型，使用类似PoemSearch.vue的逻辑
  if (selectedType.value === 'poem') {
    await getGrades() // 获取年级列表
    await getPoems() // 使用诗歌专用API
  } else {
    // 古文类型使用原来的逻辑
    await get_Articles()
  }
}

// 处理朝代切换
const handleDynastyChange = async () => {
  // 重置搜索状态
  isSearch.value = false
  searchText.value = ''
  currentPage.value = 1
  pageInfo.value = {
    startIndex: 0,
    endIndex: pageSize.value
  }
  
  // 根据选择的类型决定使用哪种API
  if (selectedType.value === 'poem') {
    await getPoems()
  } else {
    await get_Articles()
  }
}

// 处理分页变化
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  pageInfo.value = {
    startIndex: (newPage - 1) * pageSize.value,
    endIndex: newPage * pageSize.value
  }
  
  if (selectedType.value === 'poem') {
    // 古诗类型使用诗歌分页逻辑
    getPoems()
  } else {
    // 古文类型使用原来的分页逻辑
    if (isSearch.value) {
      // 如果是搜索状态，从缓存中获取对应页的数据
      articleList.value = articleListall.value.slice(
        pageInfo.value.startIndex,
        pageInfo.value.endIndex
      )
    } else {
      // 否则重新获取数据
      get_Articles()
    }
  }
}

// 处理文章点击
const handleArticleClick = (id) => {

  
  // 保存当前页面状态（包括筛选条件）
  articleStore.savePageState(
    currentPage.value,
    articleList.value,
    total.value,
    isSearch.value,
    searchText.value,
    articleListall.value,
    selectedType.value,
    selectedDynasty.value,
    selectedGrade.value,
    gradeOptions.value
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
    if (selectedType.value === 'poem') {
      // 古诗类型使用诗歌搜索逻辑
      currentPage.value = 1
      await getPoems()
    } else {
      // 古文类型使用原来的搜索逻辑
      const res = await searchArticle(searchText.value)

      // 更新文章列表和总数
      articleListall.value = res.rows
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
    }
  } else {
    // 如果搜索框为空，恢复到初始列表状态
    isSearch.value = false
    pageInfo.value = {
      startIndex: 0,
      endIndex: pageSize.value
    }
    currentPage.value = 1
    
    if (selectedType.value === 'poem') {
      await getPoems()
    } else {
      await get_Articles()
    }
  }
  loading.value = false
}

//一键清空搜索内容
const removesearchText = () => {
  searchText.value = ''
}

onMounted(async () => {
  // 检查是否是从详情页返回
  const fromDetail = route.query.from === 'detail'
  if (fromDetail && articleStore.getPageState()) {


    // 如果是从详情页返回且有缓存，恢复所有状态
    currentPage.value = articleStore.currentPage
    articleList.value = articleStore.articleList
    total.value = articleStore.total
    isSearch.value = articleStore.isSeachs
    searchText.value = articleStore.searchTexts
    articleListall.value = articleStore.articleListalls
    
    // 恢复筛选条件
    selectedType.value = articleStore.selectedType
    selectedDynasty.value = articleStore.selectedDynasty
    selectedGrade.value = articleStore.selectedGrade
    gradeOptions.value = articleStore.gradeOptions
    

    
    // 更新分页信息
    pageInfo.value = {
      startIndex: (currentPage.value - 1) * pageSize.value,
      endIndex: currentPage.value * pageSize.value
    }
    
    // 强制更新DOM，确保标签状态正确显示
    await nextTick()
    

  } else {

    // 否则根据当前选择的类型获取第一页数据
    if (selectedType.value === 'poem') {
      await getGrades() // 获取年级列表
      await getPoems() // 获取诗歌数据
    } else {
      await get_Articles() // 获取古文数据
    }
  }
})
</script>

<template>
  <div class="article-container">
    <!-- 新增：类型和朝代筛选标签（el-tag 实现） -->
    <div class="tags-filter">

      <div class="type-tags">
        <span class="filter-label">类型：</span>
        <el-tag
          v-for="type in typeOptions"
          :key="`type-${type.value}-${selectedType}`"
          :type="selectedType === type.value ? 'success' : 'info'"
          :effect="selectedType === type.value ? 'dark' : 'plain'"
          @click="selectedType = type.value; handleTypeChange()"
          class="filter-tag large-tag"
          :closable="false"
          :size="'large'"
        >
          {{ type.label }}
        </el-tag>
      </div>
      <div class="dynasty-tags">
        <span class="filter-label">朝代：</span>
        <el-tag
          v-for="dynasty in dynastyOptions"
          :key="`dynasty-${dynasty.value}-${selectedDynasty}`"
          :type="selectedDynasty === dynasty.value ? 'success' : 'info'"
          :effect="selectedDynasty === dynasty.value ? 'dark' : 'plain'"
          @click="selectedDynasty = dynasty.value; handleDynastyChange()"
          class="filter-tag large-tag"
          :closable="false"
          :size="'large'"
        >
          {{ dynasty.label }}
        </el-tag>
      </div>
    </div>
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

.tags-filter {
  margin-bottom: 20px;
  .type-tags, .dynasty-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 8px;
    .filter-label {
      margin-right: 8px;
      font-weight: bold;
      color: #333;
    }
    .filter-tag.large-tag {
      margin-right: 8px;
      margin-bottom: 4px;
      cursor: pointer;
      user-select: none;
      height: 40px;
      line-height: 38px;
      font-size: 16px;
      padding: 0 20px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      transform: none !important;
      transition: none !important;
    }
  }
}

:deep(.el-empty) {
  padding: 40px 0;
}
</style>
