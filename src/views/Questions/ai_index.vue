<script setup>
import { Check } from '@element-plus/icons-vue'

import { ref } from 'vue'

const chatMessage = ref('')
const chatList = ref(['你是谁', '这是ai的回答'])

const send = () => {
  chatList.value.push(chatMessage.value)
  chatMessage.value = ''

  chatList.value.push('这是ai的回答')
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-window" id="chatWindow">
      <!-- AI回应和用户问题会显示在这里 -->
      <ul class="msg-container">
        <li :class="{
          message: true,
          'user-message': index % 2 === 0,
          'ai-message': index % 2 !== 0
        }" v-for="(item, index) in chatList" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="input-area">
      <input v-model="chatMessage" type="text" id="userInput" placeholder="请输入你的问题" onkeydown="handleKeyPress(event)" />
      <el-button @click="send" type="success" :icon="Check" circle id="sendButton" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-container {
  //这两句让整个盒子居中
  margin: auto;
  width: 84%;

  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.chat-window {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  border-radius: 4px;
  padding: 16px;;
}

/* 用户和AI消息的样式 */
.message {
  width: auto;
  max-width: 70%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  clear: both;
}

.msg-container {
  margin: auto;
  width: 100%;
}

.ai-message {
  background-color: #e0f7fa;
  margin-left: 0;
  margin-right: auto;
  text-align: left;
  border-top-left-radius: 0;
}

.user-message {
  background-color: wheat;
  margin-left: auto;
  margin-right: 0;
  text-align: right;
  border-top-right-radius: 0;
}

//输入框
.input-area {
  margin: auto;
  width: 100%;


  display: flex;
  flex-wrap: nowrap;
  /* 防止换行 */
  align-items: center;
  /* 垂直居中对齐 */
  margin-top: 10px;
}

#userInput {
  margin: auto;
  width: 84%;


  flex-grow: 0.8;
  padding: 12px;
  margin-left: 50px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
}

#sendButton {
  margin-right: 50px;
}
</style>
