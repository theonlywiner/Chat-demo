import request from '@/utils/request'

// 根据关键词和朝代（可有可无）搜索古诗
export const searchKeyword = async (PoemKeywordQuery) => {
  try {
    const response = await request.get('/search/keyword', {
      params: {
        page: PoemKeywordQuery.page,
        pageSize: PoemKeywordQuery.pageSize,
        keyword: PoemKeywordQuery.keyword,
        dynastyId: PoemKeywordQuery.dynastyId
      }
    })

    if (response.data.code) {
      return response.data.data
    } else {
      return {
        success: false,
        error: '后端报错'
      }
    }
  } catch (error) {
    console.error('获取失败:', error.message)
    return {
      success: false,
      error: '系统错误'
    }
  }
}

// 根据关键词返回朝代统计信息，用于词云展示
export const getDynastyStatistics = async (keyword) => {
  try {
    const response = await request.get('/search/dynastiesCount', {
      params: { keyword }
    })

    // 如果响应成功且有数据
    if (response.data.code) {
      return response.data.data
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '后端报错'
      }
    }
  } catch (error) {
    console.error('获取失败:', error.message)

    return {
      success: false,
      error: '系统错误' // 统一的错误提示
    }
  }
}
