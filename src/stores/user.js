import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userName = ref({})
    const token = ref('')
    const isLogin = ref(false)
    const redirectPath = ref('') // 保存跳转来源路径
    
    //设置username
    const setUsername = (newUserName) => {
      userName.value = newUserName
    }
    //设置token
    const setToken = (newToken) => {
      token.value = newToken
      isLogin.value =
        newToken && typeof newToken === 'string' && newToken.length > 0
    }
    //移除token
    const removeToken = () => {
      token.value = ''
      isLogin.value = false
    }
    //设置跳转来源路径
    const setRedirectPath = (path) => {
      redirectPath.value = path
    }
    //获取跳转来源路径并清除
    const getAndClearRedirectPath = () => {
      const path = redirectPath.value
      redirectPath.value = ''
      return path
    }
    return {
      userName,
      token,
      isLogin,
      redirectPath,
      setUsername,
      setToken,
      removeToken,
      setRedirectPath,
      getAndClearRedirectPath
    }
  },
  {
    persist: true
  }
)
