import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticleStore = defineStore('searchArticle', () => {
  const currentPage = ref(1)
  const articleList = ref([])
  const total = ref(0)
  const isSeachs = ref(false)
  const articleListalls = ref([])
  const searchTexts = ref('')
  const selectedType = ref('poem')
  const selectedDynasty = ref('all')
  const selectedGrade = ref(0)
  const gradeOptions = ref([])
  const cacheTimeout = 1000 * 60 * 5 // 5分钟缓存

  // 保存页面状态
  const savePageState = (
    page,
    articles,
    totalCount,
    isSeach,
    searchText,
    articleListall,
    type,
    dynasty,
    grade,
    grades
  ) => {
    currentPage.value = page
    articleList.value = articles
    total.value = totalCount
    isSeachs.value = isSeach
    searchTexts.value = searchText
    articleListalls.value = articleListall
    selectedType.value = type
    selectedDynasty.value = dynasty
    selectedGrade.value = grade
    gradeOptions.value = grades



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
        type,
        dynasty,
        grade,
        grades,
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
        type,
        dynasty,
        grade,
        grades,
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
        selectedType.value = type || 'poem'
        selectedDynasty.value = dynasty || 'all'
        selectedGrade.value = grade || 0
        gradeOptions.value = grades || []
        

        
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
    selectedType.value = 'poem'
    selectedDynasty.value = 'all'
    selectedGrade.value = 0
    gradeOptions.value = []
    localStorage.removeItem('articlePageState')
  }

  return {
    currentPage,
    articleList,
    total,
    isSeachs,
    searchTexts,
    articleListalls,
    selectedType,
    selectedDynasty,
    selectedGrade,
    gradeOptions,
    savePageState,
    getPageState,
    clearPageState
  }
})
