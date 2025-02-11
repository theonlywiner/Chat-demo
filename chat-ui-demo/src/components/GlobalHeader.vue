<template>
  <div id="globalHeader">
    <!-- 弹性栅格 -->
    <a-row :wrap="false">
      <!-- logo以及网站名字 -->
      <a-col flex="200px">
        <div class="title-bar">
          <img class="logo" src="../assets/logo.svg" alt="logo">
          <div class="title">诗韵智寻demo</div>
        </div>
      </a-col>
      <!-- 导航栏 -->
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick" />
      </a-col>
      <!-- 用户 -->
      <a-col flex="100px">
        <div class="user-login-status">
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>
    </a-row>



  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { HomeOutlined, CrownOutlined, WechatOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';

//路由跳转事件
const router = useRouter();
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

//current表示默认刷新后的页面，可以从当前url获取
const current = ref<string[]>(['mail']);
//监听路由变化，更新菜单状态
router.afterEach((to) => {
  current.value = [to.path];
})
//导航栏内容
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/user/chat',
    icon: () => h(WechatOutlined),
    label: 'Chat',
    title: 'Chat',
  },
  // {
  //   key: '/user/login',
  //   label: '用户登录',
  //   title: '用户登录',
  // },
  // {
  //   key: '/user/register',
  //   label: '用户注册',
  //   title: '用户注册',
  // },
  {
    key: '/admin/userManage',
    icon: () => h(SettingOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.bilibili.com', target: '_blank' }, 'B站链接'),
    title: 'B站链接',
  },
]);
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>