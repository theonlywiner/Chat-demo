
<template>
  <!-- 最外层页面于窗口同宽，使聊天面板居中 -->
  <div class="home-view">
    <!-- 整个聊天面板 -->
    <div class="chat-panel">
      <!-- 左侧的会话列表 -->
      <div class="session-panel">
        <div class="title">AI古文学习助手</div>
        <div class="description">构建你的AI助手</div>
      </div>
      <!-- 右侧的消息记录 -->
      <div class="message-panel"></div>
    </div>
  </div>
</template>

<style scoped>

.home-view {
  display: flex;
  /* 与窗口同宽 */
  width: 100%;
  /* 水平方向居中 */
  justify-content: center;
}

.chat-panel {
  /* 让聊天面板和会话列表左右显示 */
  display: flex;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 20px 20px rgba(0, 0, 0, 0.05);
  margin-top: 70px;
}

.session-panel {
  background-color: rgb(231, 248, 255);
  width: 300px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 20px;
  position: relative;
  border-right: 1px solid rgba(0, 0, 0, 0.07);
}

.session-panel .title {
  margin-top: 20px;
  font-size: 20px;
}

.session-panel .description {
  color: rgba(0, 0, 0, 0.7);
  font-size: 10px;
  margin-top: 10px;
}

.message-panel {
  width: 700px;
  height: 800px;
}
</style>