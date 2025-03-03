import request from '@/utils/request'

//获取所有最高级别的书本信息
//java后端
export const getbooksList = async () => {
  try {
    const response = await request.get('/getbooks')

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
