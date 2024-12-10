import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const isLogin = ref(false)
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
    return {
      token,
      isLogin,
      setToken,
      removeToken
    }
  },
  {
    persist: true
  }
)
