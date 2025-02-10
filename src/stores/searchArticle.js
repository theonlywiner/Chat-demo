import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticleStore = defineStore('searchArticle', () => {
  const currentPage = ref(1)
  const articleList = ref([])
  const total = ref(0)
  const isSeachs = ref(false)
  const articleListalls = ref([])
  const searchTexts = ref('')
  const cacheTimeout = 1000 * 60 * 5 // 5分钟缓存

  // 保存页面状态
  const savePageState = (
    page,
    articles,
    totalCount,
    isSeach,
    searchText,
    articleListall
  ) => {
    currentPage.value = page
    articleList.value = articles
    total.value = totalCount
    isSeachs.value = isSeach
    searchTexts.value = searchText
    articleListalls.value = articleListall

    // 保存到 localStorage，带上时间戳
    localStorage.setItem(
      'articlePageState',
      JSON.stringify({
        page,
        articles,
        articleListalls,
        isSeachs,
        searchTexts,
        total: totalCount,
        timestamp: Date.now()
      })
    )
  }

  // 获取缓存的页面状态
  const getPageState = () => {
    const cached = localStorage.getItem('articlePageState')
    if (cached) {
      const {
        page,
        articles,
        articleListalls,
        isSeachs,
        searchTexts,
        total: totalCount,
        timestamp
      } = JSON.parse(cached)
      // 检查缓存是否过期
      if (Date.now() - timestamp < cacheTimeout) {
        currentPage.value = page
        articleList.value = articles
        total.value = totalCount
        isSeachs.value = isSeachs
        searchTexts.value = searchTexts
        articleListalls.value = articleListalls
        return true
      }
      // 缓存过期，清除
      localStorage.removeItem('articlePageState')
    }
    return false
  }

  // 清除缓存
  const clearPageState = () => {
    currentPage.value = 1
    articleList.value = []
    total.value = 0
    isSeachs.value = false
    searchTexts.value = ''
    articleListalls.value = []
    localStorage.removeItem('articlePageState')
  }

  return {
    currentPage,
    articleList,
    total,
    isSeachs,
    searchTexts,
    articleListalls,
    savePageState,
    getPageState,
    clearPageState
  }
})
