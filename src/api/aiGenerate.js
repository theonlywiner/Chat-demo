import request from '@/utils/request'

//调用AI生成题目接口
export const aiGenerateQuestions = async (aiGenerateDTO) => {
  try {
    const response = await request.post('/ai/generate-questions', aiGenerateDTO)

    // 如果响应成功且有数据
    if (response.data.code) {
      return response.data.data
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '系统错误' // 统一的错误提示
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

//根据题目sessionId，查看题目信息
export const getQuestionsBySessionId = async (sessionId) => {
  try {
    const response = await request.get(`/ai/questionDetail`, {
      params: { sessionId }
    })

    // 如果响应成功且有数据
    if (response.data.code) {
      return response.data.data
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '系统错误' // 统一的错误提示
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

//查询题目历史记录
export const getQuestionsHistory = async (
  page,
  pageSize,
  startTime,
  endTime,
  word
) => {
  try {
    const response = await request.get('/ai/questions-history', {
      params: {
        page: page,
        pageSize: pageSize,
        startTime: startTime,
        endTime: endTime,
        word: word
      }
    })

    // 如果响应成功且有数据
    if (response.data.code) {
      return response.data.data
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '系统错误' // 统一的错误提示
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

//删除历史记录
export const deleteQuestionsHistory = async (sessionId) => {
  try {
    const response = await request.delete(`/ai/deleteQuestions`, {
      params: { sessionId }
    })

    // 如果响应成功且有数据
    if (response.data.code) {
      return '删除成功'
    } else {
      // 如果没有查到相关内容
      return {
        success: false,
        error: '系统错误' // 统一的错误提示
      }
    }
  } catch (error) {
    console.error('删除失败:', error.message)

    return {
      success: false,
      error: '系统错误' // 统一的错误提示
    }
  }
}
