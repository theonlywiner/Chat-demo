import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
//没有后端接入  模拟登录注册
//登录
export const userLoginService = (obj) => {
  if (obj.username === 'admin' && obj.password === '123456') {
    //模拟设置token
    userStore.setToken('admin')
    return true
  }
}

//注册
export const userRegisterService = (obj) => {
  if (obj.username === 'admin' && obj.password === '123456') {
    return true
  }
}
