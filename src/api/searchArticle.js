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

//获取年级列表
export const getGradeList = async () => {
  try {
    const response = await request.get('/getGradeList')

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

//根据年级获取文章列表(如果id为0的情况)
export const getArticleListByGrade = async (PoemPageQuery) => {
  try {
    const response = await request.get('/poems', {
      params: {
        page: PoemPageQuery.page,
        pageSize: PoemPageQuery.pageSize,
        gradeId: PoemPageQuery.gradeId,
        name: PoemPageQuery.name
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

//获取文章列表(如果id不为0的情况)
export const getArticleListById = async (PoemPageQueryGrade) => {
  try {
    const response = await request.get('/poemsByGrade', {
      params: {
        page: PoemPageQueryGrade.page,
        pageSize: PoemPageQueryGrade.pageSize,
        gradeId: PoemPageQueryGrade.gradeId,
        name: PoemPageQueryGrade.name
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

//获取古诗详情
export const getPoemDetail = async (id) => {
  try {
    const response = await request.get(`/poem/${id}`)

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
      error: '系统错误'
    }
  }
}

//获取相关联的古诗名字
export const getRelatedPoems = async (ids) => {
  try {
    const response = await request.get(`/poemsName`, {
      params: {
        ids: ids.join(',') // 将数组转换为逗号分隔的字符串
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
      error: '系统错误'
    }
  }
}

// 获取朝代列表
export const getDynastyList = async () => {
  try {
    const response = await request.get('/dynasties')

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
