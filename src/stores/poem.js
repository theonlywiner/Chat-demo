import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePoemStore = defineStore(
  'poem',
  () => {
    const currentPage = ref(1)
    const pageSize = ref(5)
    const selectedGrade = ref(0)
    const searchText = ref('')
    const articleList = ref([])
    const total = ref(0)
    const gradeOptions = ref([])
    const cacheTimeout = 1000 * 60 * 5 // 5分钟缓存

    // 保存页面状态
    const savePageState = (
      page,
      size,
      grade,
      text,
      articles,
      totalCount,
      grades
    ) => {
      currentPage.value = page
      pageSize.value = size
      selectedGrade.value = grade
      searchText.value = text
      articleList.value = articles
      total.value = totalCount
      gradeOptions.value = grades

      // 保存到 localStorage
      localStorage.setItem(
        'poemPageState',
        JSON.stringify({
          page,
          size,
          grade,
          text,
          articles,
          total: totalCount,
          grades,
          timestamp: Date.now()
        })
      )
    }

    // 获取缓存的页面状态
    const getPageState = () => {
      const cached = localStorage.getItem('poemPageState')
      if (cached) {
        const {
          page,
          size,
          grade,
          text,
          articles,
          total: totalCount,
          grades,
          timestamp
        } = JSON.parse(cached)

        if (Date.now() - timestamp < cacheTimeout) {
          currentPage.value = page
          pageSize.value = size
          selectedGrade.value = grade
          searchText.value = text
          articleList.value = articles
          total.value = totalCount
          gradeOptions.value = grades
          return true
        }
        localStorage.removeItem('poemPageState')
      }
      return false
    }

    // 清除状态
    const clearPageState = () => {
      currentPage.value = 1
      pageSize.value = 5
      selectedGrade.value = 0
      searchText.value = ''
      articleList.value = []
      total.value = 0
      gradeOptions.value = []
      localStorage.removeItem('poemPageState')
    }

    return {
      currentPage,
      pageSize,
      selectedGrade,
      searchText,
      articleList,
      total,
      gradeOptions,
      savePageState,
      getPageState,
      clearPageState
    }
  },
  {
    persist: true // 开启持久化
  }
)
