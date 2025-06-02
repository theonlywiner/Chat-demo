import request from '@/utils/request'

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
 *     dynasty: string
 *   }
 * }>}
 */
export const getDailyPoem = async () => {
  try {
    const response = await request.get('/poem/daily')
    return response.data
  } catch (error) {
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
  dynasty: '未知'
} 