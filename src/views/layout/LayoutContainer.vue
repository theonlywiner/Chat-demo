<script setup>
import {
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import emptyImg from '@/assets/empty.png'
import avatar from '@/assets/user.png'

import DailyQuote from '@/components/DailyQuote.vue'

const userStore = useUserStore()
const router = useRouter()

// 模拟用户现在处于登录状态
const isLogin = true;

// // isLogin用于判断用户是否登录  改变顶部状态
// const isLogin = computed(() => {
//   return userStore.isLogin
// })

// 导航菜单配置
const navItems = [
  { name: '首页', path: '/article/channel' },
  { name: '搜索', path: '/article/search' },
  { name: '解析', path: '/article/question' },
  { name: 'AI对话', path: '/article/ai_chat' }
]

// 处理导航点击
const handleNavClick = (path) => {
  router.push(path)
}

//下拉菜单
const handleCommand = async (key) => {

  if (key === 'login') {
    //登录按钮
    router.push('/login')
    return
  } 
  else if (key === 'logout') {
    //退出按钮
    await ElMessageBox.confirm('确定要退出吗', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        //清除token 跳转到登录页面
        userStore.removeToken()
        router.push('/login')
        ElMessage.success('退出成功')
      })
      .catch(() => { })
  }
  else if (key === 'profile') {
    //用户信息
    router.push('/profile')
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <el-row class="layout">
          <el-col :span="4">
            <!-- Logo区域 -->
            <div class="logo-area">
              <img :src="emptyImg" alt="Logo" class="logo-image" />
            </div>
          </el-col>
          <el-col :span="16">
            <!-- 导航菜单 -->
            <div class="nav-menu">
              <el-menu mode="horizontal" :router="true" :default-active="$route.path" class="nav-items"
                :ellipsis="false">
                <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path"
                  @click="handleNavClick(item.path)">
                  {{ item.name }}
                </el-menu-item>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="4">
            <!-- 用户区域 - 保留原有的用户信息和下拉菜单 -->
            <div class="user-area">
              <!-- 用户姓名 -->
              <div class="username">
                {{ isLogin ? '尊敬的用户:' + userStore.username : '未登录' }}
              </div>
              <!-- 头像的下拉菜单 -->
              <el-dropdown placement="bottom-end" @command="handleCommand">
                <!-- 头像 -->
                <span class="el-dropdown__box">
                  <el-avatar :src="avatar" />
                  <el-icon>
                    <CaretBottom />
                  </el-icon>
                </span>

                <!-- 下拉部分 -->
                <template #dropdown>
                  <el-dropdown-menu v-if="isLogin">
                    <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                    <!-- <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                    <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item> -->
                    <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>

                    
                  </el-dropdown-menu>
                  <el-dropdown-menu v-else>
                    <el-dropdown-item command="login" :icon="User">登录账号</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="grid-content ep-bg-purple" />
          </el-col>
        </el-row>

        <!-- <div class="header-container">

        </div> -->
      </el-header>
      <!-- 内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <!-- 底部 -->
      <el-footer class="footer">

        <div class="daily">
          <DailyQuote></DailyQuote>
        </div>
        <br /><br />
        <div>
          测试版--浙外ai问答助手
        </div>

      </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.daily {
  background-color: wheat;
}

.main {
  margin-left: 15%;
  margin-right: 15%;
}

.footer {
  display: flex;
  flex-direction: column;
}

.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #fff;
  padding: 0;
  /* 移除默认padding */
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  /* 防止header被压缩 */
}

// 让layout里面的元素竖直居中（默认有display:flex）
.el-row {
  align-items: center;
}

.el-col {
  justify-content: center;
}

// .main {
//   margin: auto;
//   width: 84%;
// }

/*
.header-container {
  width: 1200px;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 150px;
  margin: 0 auto;
}
*/
.logo-area {
  display: flex;
  justify-content: center;
  // margin-left: 160px;

  .logo-image {
    height: 40px;
    width: auto;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  flex-grow: 1;

  .nav-items {
    border-bottom: none;
    display: flex;
    justify-content: flex-start;
    width: auto;
  }

  :deep(.el-menu) {
    border-bottom: none;
  }

  :deep(.el-menu--horizontal) {
    border-bottom: none;
    display: flex;
    flex-wrap: nowrap;
  }

  :deep(.el-menu-item) {
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;

    &.is-active {
      font-weight: bold;
    }
  }
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  white-space: nowrap;

  .username {
    font-size: 14px;
    color: #606266;
  }

  .el-dropdown__box {
    display: flex;
    align-items: center;
    cursor: pointer;

    .el-icon {
      color: black;
      margin-left: 10px;
    }

    &:active,
    &:focus {
      outline: none;
    }
  }
}

.el-main {
  flex: 1;
  /* 填充剩余空间 */
  padding: 20px;
  background-color: #f5f7fa;
  overflow-y: auto;
  /* 允许内容滚动 */
}

.el-footer {
  flex-shrink: 0;
  /* 防止footer被压缩 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}
</style>
