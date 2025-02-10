import request from '@/utils/request'

// 查询古文内容
export const queryAncientText = async (queryText) => {
  try {
    const response = await request.post(`/query`, {
      query: queryText
    })

    // 如果响应成功且有数据
    if (response.data.success === true) {
      return {
        success: true,
        data: response.data.result
      }
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '有点超过了我的能力范围哦~'
      }
    }
  } catch (error) {
    console.error('查询失败:', error.message)
    console.log(111)

    return {
      success: false,
      error: '有点超过了我的能力范围哦~' // 统一的错误提示
    }
  }
}
