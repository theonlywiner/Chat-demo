import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticle = defineStore('article', () => {
  const books_List = ref([])
  const cacheTimeout = 1000 * 60 * 5 // 5分钟缓存

  // 保存页面状态
  const savePageState = (books) => {
    books_List.value = books
    // 保存到 localStorage，带上时间戳
    localStorage.setItem(
      'article',
      JSON.stringify({
        books: books_List.value,
        timestamp: Date.now()
      })
    )
  }

  // 获取缓存的页面状态
  const getPageState = () => {
    const cached = localStorage.getItem('article')
    if (cached) {
      const { books, timestamp } = JSON.parse(cached)
      // 检查缓存是否过期
      if (Date.now() - timestamp < cacheTimeout) {
        books_List.value = books
        return true
      }
      // 缓存过期，清除
      localStorage.removeItem('articlePageState')
    }
    return false
  }

  // 清除缓存
  const clearPageState = () => {
    books_List.value = []
    localStorage.removeItem('articlePageState')
  }

  return {
    books_List,
    savePageState,
    getPageState,
    clearPageState
  }
})
