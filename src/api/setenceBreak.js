import request from '@/utils/request'

// 调用断句题目生成接口
export const generateSentenceBreakQuestions = async (sentenceBreakDTO) => {
  try {
    const response = await request.post('/ai/generate-questions/sentence-breaking', sentenceBreakDTO)

    // 如果响应成功且有数据
    if (response.data.code) {
      return response.data.data
    } else {
      return {
        success: false,
        error: '系统错误'
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

// 根据题目
