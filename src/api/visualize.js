import request from '@/utils/request'

//获取所有朝代信息
export const getAllDynasty = async () => {
  try {
    const response = await request.get('/visualization/dynasties') // 注意接口前缀是否匹配

    if (response.data.code === 1) {
      return response.data
    } else {
      ElMessage.error(response.data.msg || '请求失败')
      return null
    }
  } catch (error) {
    // 统一错误处理
    const errorMessage =
      error.response?.data?.msg || error.message || '请求异常'
    ElMessage.error(errorMessage)
    return null
  }
}

// 获取所有作者信息
export const getAllAuthors = async () => {
  try {
    const response = await request.get('/visualization/getAllAuthor') // 注意接口前缀是否匹配

    if (response.data.code === 1) {
      return response.data
    } else {
      ElMessage.error(response.data.msg || '请求失败')
      return null
    }
  } catch (error) {
    // 统一错误处理
    const errorMessage =
      error.response?.data?.msg || error.message || '请求异常'
    ElMessage.error(errorMessage)
    return null
  }
}

// 获取单个作者信息
export const getAuthorInfo = async (id) => {
  try {
    const response = await request.get('/visualization/getAuthorInfo', {
      params: { id }
    }) // 注意接口前缀是否匹配

    if (response.data.code === 1) {
      return response.data
    } else {
      ElMessage.error(response.data.msg || '请求失败')
      return null
    }
  } catch (error) {
    // 统一错误处理
    const errorMessage =
      error.response?.data?.msg || error.message || '请求异常'
    ElMessage.error(errorMessage)
    return null
  }
}

// 获取词频统计数据
export const getWordFrequency = async (id) => {
  try {
    const response = await request.get('/visualization/getAuthorWordCloud', {
      params: { id }
    }) // 注意接口前缀是否匹配// 注意接口前缀是否匹配

    if (response.data.code === 1) {
      return response.data
    } else {
      ElMessage.error(response.data.msg || '请求失败')
      return null
    }
  } catch (error) {
    // 统一错误处理
    const errorMessage =
      error.response?.data?.msg || error.message || '请求异常'
    ElMessage.error(errorMessage)
    return null
  }
}
