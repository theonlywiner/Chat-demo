//获取文章信息
import request from '@/utils/request'
//获取全部列表
export const getArticleList = async (pageInfo) => {
  try {
    const response = await request.get('/getArticleList', {
      params: {
        startIndex: pageInfo.startIndex,
        endIndex: pageInfo.endIndex
      }
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

//获取文章详情 + 导航栏
export const getArticleDetail = async (id) => {
  try {
    const response = await request.get('/getArticleDetail', {
      params: { id: id }
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

//搜索文章标题
export const searchArticle = async (title) => {
  try {
    const response = await request.get('/searchArticles', {
      params: { title: title }
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
