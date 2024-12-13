import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

//登录
export const userLoginService = async (obj) => {
  try {
    const response = await request.post(`/login`, {
      username: obj.username,
      password: obj.password
    })

    // 确保只有在真正成功时才返回true
    if (response.status === 200 && response.data.message === '登录成功') {
      userStore.setToken(obj.username)
      return true
    }
    return false
  } catch (error) {
    // 处理错误响应
    const errorMessage = error.response?.data?.message || '登录失败'
    console.error('登录失败:', errorMessage)
    ElMessage.error(errorMessage)
    return false
  }
}

//注册
export const userRegisterService = async (obj) => {
  try {
    const response = await request.post(`/register`, {
      username: obj.username,
      password: obj.password
    })

    if (response.status === 201 && response.data.message === '注册成功') {
      return true
    }
    return false
  } catch (error) {
    // 处理错误响应
    const errorMessage = error.response?.data?.message || '注册失败'
    console.error('注册失败:', errorMessage)
    ElMessage.error(errorMessage)
    return false
  }
}
