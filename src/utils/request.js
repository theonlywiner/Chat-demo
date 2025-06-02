import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API地址配置
const CLOUD_API_URL = 'https://your-cloud-api.com' // 请替换为您的实际云端API地址
const LOCAL_API_URL = 'http://localhost:8080'

// 检查云端API是否可用的函数
const checkCloudApiAvailable = async () => {
  try {
    const response = await fetch(CLOUD_API_URL + '/health', { 
      method: 'HEAD',
      timeout: 3000
    })
    return response.ok
  } catch (error) {
    console.warn('Cloud API is not available, fallback to local API')
    return false
  }
}

// 动态获取baseURL
const getBaseURL = async () => {
  const isCloudAvailable = await checkCloudApiAvailable()
  return isCloudAvailable ? CLOUD_API_URL : LOCAL_API_URL
}

// 创建axios实例
const instance = axios.create({
  timeout: 15000
})

// 动态设置baseURL
getBaseURL().then(baseURL => {
  instance.defaults.baseURL = baseURL
  console.log('Current API URL:', baseURL)
})

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 每次请求前检查并更新baseURL
    config.baseURL = await getBaseURL()
    
    // 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

//响应拦截器
instance.interceptors.response.use(
  (res) => {
    //1.数据请求成功
    if (res.data.code) {
      return res
    }

    // 2.数据请求失败给错误提示
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    //401错误 特殊情况
    //原因: token过期 权限不足 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    //错误的默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

// 默认导入
export default instance
// 按需导出
export const baseURL = instance.defaults.baseURL
