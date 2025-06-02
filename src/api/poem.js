import request from '@/utils/request'

const CACHE_KEY = 'daily_poem_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时的毫秒数

/**
 * 获取每日一诗
 * @returns {Promise<{
 *   code: number,
 *   msg: string,
 *   data: {
 *     id: string,
 *     title: string,
 *     author: string,
 *     content: string,
 *     dynasty: string,
 *     background: string,
 *   }
 * }>}
 */
export const getDailyPoem = async () => {
  try {
    // 检查缓存
    const cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      // 如果缓存未过期，直接返回缓存数据
      if (Date.now() - timestamp < CACHE_DURATION) {
        return {
          code: 1,
          msg: 'success',
          data
        }
      }
    }

    // 缓存不存在或已过期，请求新数据
    const response = await request.get('/poem/daily')
    
    // 如果请求成功，更新缓存
    if (response.data.code === 1) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: response.data.data,
        timestamp: Date.now()
      }))
    }
    
    return response.data
  } catch (error) {
    // 如果请求失败但有缓存，返回缓存数据
    const cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      const { data } = JSON.parse(cachedData)
      return {
        code: 1,
        msg: 'success (cached)',
        data
      }
    }
    
    return {
      code: 0,
      msg: '系统错误',
      data: null
    }
  }
}

/**
 * 格式化诗词内容
 * 将字符串转换为诗句数组，处理标点符号
 * @param {string} content - 原始诗词内容
 * @returns {string[]} - 格式化后的诗句数组
 */
export const formatPoemContent = (content) => {
  return content
    .split(/[。？！]/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line + '。')
}

/**
 * 默认诗词数据
 */
export const DEFAULT_POEM = {
  title: '暂无诗词',
  author: '未知',
  content: ['数据加载失败，请稍后重试'],
  dynasty: '未知',
  background: '暂无创作背景信息'
} 