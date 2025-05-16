import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore(
  'search',
  () => {
    const currentPage = ref(1)
    const pageSize = ref(5)
    const selectedDynasty = ref('')
    const searchText = ref('')
    const articleList = ref([])
    const total = ref(0)
    const dynastyOptions = ref([])
    const cacheTimeout = 1000 * 60 * 5 // 5分钟缓存

    // 保存页面状态
    const savePageState = (
      page,
      size,
      dynasty,
      text,
      articles,
      totalCount,
      dynasties
    ) => {
      currentPage.value = page
      pageSize.value = size
      selectedDynasty.value = dynasty
      searchText.value = text
      articleList.value = articles
      total.value = totalCount
      dynastyOptions.value = dynasties

      // 保存到 localStorage
      localStorage.setItem(
        'searchPageState',
        JSON.stringify({
          page,
          size,
          dynasty,
          text,
          articles,
          total: totalCount,
          dynasties,
          timestamp: Date.now()
        })
      )
    }

    // 获取缓存的页面状态
    const getPageState = () => {
      const cached = localStorage.getItem('searchPageState')
      if (cached) {
        const {
          page,
          size,
          dynasty,
          text,
          articles,
          total: totalCount,
          dynasties,
          timestamp
        } = JSON.parse(cached)

        if (Date.now() - timestamp < cacheTimeout) {
          currentPage.value = page
          pageSize.value = size
          selectedDynasty.value = dynasty
          searchText.value = text
          articleList.value = articles
          total.value = totalCount
          dynastyOptions.value = dynasties
          return true
        }
        localStorage.removeItem('searchPageState')
      }
      return false
    }

    // 清除状态
    const clearPageState = () => {
      currentPage.value = 1
      pageSize.value = 5
      selectedDynasty.value = ''
      searchText.value = ''
      articleList.value = []
      total.value = 0
      dynastyOptions.value = []
      localStorage.removeItem('searchPageState')
    }

    return {
      currentPage,
      pageSize,
      selectedDynasty,
      searchText,
      articleList,
      total,
      dynastyOptions,
      savePageState,
      getPageState,
      clearPageState
    }
  },
  {
    persist: true // 开启持久化
  }
)
