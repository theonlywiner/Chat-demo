import axios from 'axios'
// import { useUserStore } from '@/stores/user'
// import { ElMessage } from 'element-plus'
//这里没有采用 import { useRouter } from 'vue-router'
// const router = useRouter() 是因为这个方法在组件中使用，这里也可以用，但是下面的更简单
// import router from '@/router'

const baseURL = 'http://localhost:5000'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间,请求头
  baseURL,
  timeout: 15000
})

//请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // TODO 2. 携带token
//     const userStore = useUserStore()
//     if (userStore.token) {
//       config.headers.Authorization = userStore.token
//     }

//     return config
//   },
//   (err) => Promise.reject(err)
// )

// //响应拦截器
// instance.interceptors.response.use(
//   (res) => {
//     //1.数据请求成功
//     if (res.data.code === 0) {
//       return res
//     }

//     // 2.数据请求失败给错误提示
//     // 把结果可视化
//     ElMessage.error(res.data.message || '服务异常')
//     return Promise.reject(res.data)
//   },
//   (err) => {
//     //401错误 特殊情况
//     //原因: token过期 权限不足 => 拦截到登录
//     // response? 表示可有可无
//     if (err.response?.status === 401) {
//       router.push('/login')
//     }

//     //错误的默认情况
//     ElMessage.error(err.response.data.message || '服务异常')
//     return Promise.reject(err)
//   }
// )

// 默认导入
export default instance
// 按需导出
export { baseURL }
