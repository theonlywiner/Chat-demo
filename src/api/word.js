import request from '@/utils/request'

// 查询词信息
export const queryWordInfo = async (word, initial, priority) => {
  try {
    const response = await request.get(`/word/searchWord`, {
      params: {
        word: word,
        initial: initial,
        priority: priority
      }
    })

    if (response.data.code) {
      return response.data
    } else {
      // 显示后端返回的错误消息
      ElMessage.error(response.data.msg)
      return false
    }
  } catch (error) {
    // 处理错误响应，显示后端返回的具体错误信息
    const errorMessage = error.response?.data?.message || '查询失败'
    ElMessage.error(errorMessage)
    return false
  }
}

// 查询分类类别
export const queryWordClass = async () => {
  try {
    const response = await request.get(`/word/searchWordClass`)
    if (response.data.code) {
      return response.data
    } else {
      // 显示后端返回的错误消息
      ElMessage.error(response.data.msg)
      return false
    }
  } catch (error) {
    // 处理错误响应，显示后端返回的具体错误信息
    const errorMessage = error.response?.data?.message || '查询失败'
    ElMessage.error(errorMessage)
    return false
  }
}
