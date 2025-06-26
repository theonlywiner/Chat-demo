import axios from 'axios'
// import { useUserStore } from '@/stores/user'
// import { ElMessage } from 'element-plus'
//这里没有采用 import { useRouter } from 'vue-router'
// const router = useRouter() 是因为这个方法在组件中使用，这里也可以用，但是下面的更简单
import router from '@/router'

//基本基地址
// const baseURL = 'http://localhost:8080'
//改为nginx
const baseURL = '/api'
// 服务器地址
// const baseURL = 'http://121.40.171.211:8090'

// 创建axios实例
const instance = axios.create({
  // TODO 1. 基础地址，超时时间,请求头
  baseURL,
  timeout: 30000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user')
    let token = ''
    if (userStr) {
      try {
        token = JSON.parse(userStr).token
      } catch {
        console.error('解析 localStorage 中的 user 时出错')
      }
    }
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (err) => Promise.reject(err)
)

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    // //1.数据请求成功
    // if (res.data.code === 1) {
    //   return res
    // }
    // // 2.数据请求失败给错误提示
    // // 把结果可视化
    // ElMessage.error(res.data.msg)
    // return Promise.reject(res.data)
    return res // 直接返回数据
  },
  (err) => {
    //401错误 特殊情况
    if (err.response?.status === 401) {
      ElMessageBox.confirm('登录信息已过期，是否重新登录？', '提示', {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          router.push('/login')
        })
        .catch(() => {})
      return Promise.reject(err)
    }
    //错误的默认情况
    ElMessage.error(err.response.data.msg || '服务异常')
    return Promise.reject(err)
  }
)

// 默认导入
export default instance
// 按需导出
export { baseURL }
// export const baseURL = instance.defaults.baseURL
