<script setup>
import {
  Delete,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  CaretRight,
  CaretLeft
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
//模拟历史数据
const historyList = ref(['历史记录1', '历史记录2', '历史记录3', '历史记录4'])

// isLogin用于判断用户是否登录  改变顶部状态
const isLogin = computed(() => {
  return userStore.isLogin
})

//清空记录
const clearAll = () => {
  historyList.value = []
}

//下拉菜单
const handleCommand = async (key) => {
  //登录按钮
  if (key === 'login') {
    router.push('/login')
    return
  }
  //退出按钮
  if (key === 'logout') {
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
      .catch(() => {})
  }
}

// 添加侧边栏收起状态的控制
const isCollapse = ref(false)

// 添加切换方法
const toggleAside = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 修改侧边栏部分 -->
    <el-aside :width="isCollapse ? '64px' : '300px'" class="aside-container">
      <!-- 添加收起按钮 -->
      <div class="collapse-btn" @click="toggleAside">
        <el-icon>
          <CaretRight v-if="isCollapse" />
          <CaretLeft v-else />
        </el-icon>
      </div>

      <!-- logo位置 -->
      <div class="el-aside__logo"></div>
      <!-- 历史记录 -->
      <div class="inline-flex" v-show="!isCollapse">
        <ul>
          <li v-for="item in historyList" :key="item">{{ item }}</li>
        </ul>
        <!-- 清空历史 -->
        <el-button type="danger" :icon="Delete" circle @click="clearAll" />
      </div>
    </el-aside>
    <!-- 顶部 -->
    <el-container>
      <el-header>
        <!-- 用户姓名 -->
        <div>{{ isLogin ? '尊敬的用户:' + userStore.token : '未登录' }}</div>
        <!-- 头像的下拉菜单 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 头像 -->
          <span class="el-dropdown__box">
            <el-avatar src="src\assets\user.png" />

            <el-icon><CaretBottom /></el-icon>
          </span>

          <!-- 下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu v-if="isLogin">
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
            <el-dropdown-menu v-else>
              <el-dropdown-item command="login" :icon="User"
                >登录账号</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>测试版--浙外ai问答助手</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.layout-container {
  height: 100vh;
}
.el-aside {
  background-color: #232323;
  .el-aside__logo {
    height: 120px;
    background: url('@/assets/empty.png') no-repeat center / 50px auto;
  }
  .inline-flex {
    position: relative;
    background-color: white;
    width: 80%;
    height: 80%;
    margin-left: 10%;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding-top: 20px;
    li {
      padding: 20px 0;
      margin-right: 20px;
      border-bottom: 1px solid #ccc;
      font-size: 16px;
      color: #666;
      &:hover {
        color: #409eff;
      }
    }
    .el-button {
      position: absolute;
      bottom: 5%; /* 将按钮定位到盒子的底部 */
      left: 50%; /* 将按钮水平居中 */
      transform: translateX(
        -50%
      ); /* 使用 transform 属性将按钮向左移动自身宽度的 50%，以实现水平居中 */
    }
  }
}
.el-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown__box {
    display: flex;
    align-items: center;
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
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}
.aside-container {
  position: relative;
  transition: width 0.3s;
  overflow: hidden;
}

.collapse-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px 0 0 4px;
  z-index: 100;

  &:hover {
    background-color: #f2f2f2;
  }

  .el-icon {
    font-size: 16px;
    color: #666;
  }
}
</style>
