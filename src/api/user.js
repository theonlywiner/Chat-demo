import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

//登录
// export const userLoginService = async (obj) => {
//   try {
//     const response = await request.post(`/login`, {
//       username: obj.username,
//       password: obj.password
//     })

//     if (response.data.success) {
//       userStore.setToken(obj.username)
//       return true
//     } else {
//       // 显示后端返回的错误消息
//       ElMessage.error(response.data.message)
//       return false
//     }
//   } catch (error) {
//     // 处理错误响应，显示后端返回的具体错误信息
//     const errorMessage = error.response?.data?.message || '登录失败'
//     ElMessage.error(errorMessage)
//     return false
//   }
// }

//java后端
export const userLoginService = async (obj) => {
  try {
    const response = await request.post(`/users/login`, {
      username: obj.username,
      password: obj.password
    })

    if (response.data.code) {
      userStore.setUsername(response.data.data.userName)
      userStore.setToken(response.data.data.token)
      return response.data
    } else {
      // 显示后端返回的错误消息
      ElMessage.error(response.data.msg)
      return false
    }
  } catch (error) {
    // 处理错误响应，显示后端返回的具体错误信息
    const errorMessage = error.response?.data?.message || '登录失败'
    ElMessage.error(errorMessage)
    return false
  }
}

//注册
// 导出一个异步函数，用于用户注册
// export const userRegisterService = async (obj) => {
//   try {
//     const response = await request.post(`/register`, {
//       username: obj.username,
//       password: obj.password
//     })

//     if (response.data.message === '注册成功') {
//       return true
//     } else {
//       // 显示后端返回的错误消息
//       ElMessage.error(response.data.message)
//       return false
//     }
//   } catch (error) {
//     // 处理错误响应，显示后端返回的具体错误信息
//     const errorMessage = error.response?.data?.message || '注册失败'
//     ElMessage.error(errorMessage)
//     return false
//   }
// }

//java后端
export const userRegisterService = async (obj) => {
  try {
    const response = await request.post(`/users/register`, {
      username: obj.username,
      password: obj.password
    })

    if (response.data.code) {
      return true
    } else {
      // 显示后端返回的错误消息
      ElMessage.error(response.data.msg)
      return false
    }
  } catch (error) {
    // 处理错误响应，显示后端返回的具体错误信息
    const errorMessage = error.response?.data?.data.msg || '注册失败'
    ElMessage.error(errorMessage)
    return error.response?.data?.data.msg
  }
}
