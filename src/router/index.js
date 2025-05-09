import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/channel',
      children: [
        {
          path: 'article/channel',
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: 'article/search',
          component: () => import('@/views/Search/index.vue')
        },
        {
          path: 'article/PoemSearch',
          component: () => import('@/views/Search/PoemSearch.vue')
        },
        {
          path: 'article/question',
          component: () => import('@/views/Questions/index.vue')
        },
        {
          path: 'article/ai_chat',
          component: () => import('@/views/Questions/ai_index_collapse.vue')
        },
        {
          path: 'article/visualization',
          component: () => import('@/views/Visualization/index.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/User/Profile.vue')
        },
        {
          path: '/search_prodetail/:id',
          name: 'prodetail',
          component: () => import('@/views/Prodetail/index.vue')
        },
        {
          path: '/poem_detail/:id',
          name: 'poemDetail',
          component: () => import('@/views/Prodetail/PoemDetail.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue')
    }
  ],
  // 路由切换时，滚动到顶部
  // 解决路由切换时，页面不回到顶部的问题
  scrollBehavior() {
    return { top: 0 }
  }
})

//前置守卫
// router.beforeEach((to) => {
//   const userStore = useUserStore()
//   if (!userStore.token && to.path !== '/login') {
//     return '/login'
//   }
// })

export default router
