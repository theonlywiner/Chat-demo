<script setup>
import avatar from '@/assets/user.png'
</script>

<template>
  <div class="container">
    这里是用户页面

    <div class="basic">
      <el-avatar :size="200" :src="avatar" />
      <span class="info">用户基本信息(从后端获取)</span>
    </div>

    <div class="settings">
      <el-button type="primary" round>修改头像（wip）</el-button>
      <br /><br />
      <el-button type="warning" round>重置密码（wip）</el-button>
      <br /><br />
      <el-button type="danger" round>注销账号（wip）</el-button>
    </div>
  </div>
</template>

<style scoped>
.settings {
  padding: 5%;
  background-color: wheat;
  height: 250px;
}

.info {
  background-color: white;
  height: 200px;
  width: 70%;
}

.basic {
  padding: 5%;
  background-color: wheat;
  height: 250px;
  display: flex;
  text-align: center;
  align-items: center;
}

.container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 10%;
}
</style>
