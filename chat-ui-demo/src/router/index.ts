import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ChatPage from '@/pages/user/ChatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 欢迎页
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    // AI交互页面
    {
      path: '/user/chat',
      name: 'char',
      component: ChatPage,
    },
    // 登录页面
    {
      path: '/user/login',
      name: 'userLogin',
      component: UserLoginPage,
    },
    // 注册页面
    {
      path: '/user/register',
      name: 'useRegister',
      component: UserRegisterPage,
    },
    // 用户管理页面
    {
      path: '/admin/userManage',
      name: 'adminUserManage',
      component: UserManagePage,
    },
    
  ],
})

export default router
