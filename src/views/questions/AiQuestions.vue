<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const inputText = ref('')
const aiResponse = ref('')
const fileList = ref([])

// 允许上传的文件类型
const allowedTypes = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    '.pptx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'image/jpeg': '.jpg',
  'image/png': '.png'
}

// 上传前的验证
const beforeUpload = (file) => {
  // 检查文件类型
  if (!allowedTypes[file.type]) {
    ElMessage.error('不支持的文件类型！')
    return false
  }

  // 检查文件大小（这里设置为20MB）
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) {
    ElMessage.error('文件大小不能超过 20MB!')
    return false
  }

  return true
}

// 处理文件上传
const handleUpload = (uploadFile) => {
  if (beforeUpload(uploadFile.raw)) {
    fileList.value = [uploadFile]
  }
}

// 处理超出文件数量限制
const handleExceed = () => {
  return false
}

// 发送消息到后台
const sendMessage = async () => {
  if (!inputText.value && fileList.value.length === 0) {
    ElMessage.warning('请输入内容或上传文件')
    return
  }

  try {
    // 创建 FormData 对象用于发送文件
    const formData = new FormData()
    formData.append('text', inputText.value)

    // 添加文件到 FormData
    fileList.value.forEach((file) => {
      formData.append('files', file.raw)
    })

    // TODO: 发送请求到后端
    // const response = await axios.post('/api/chat', formData)
    // aiResponse.value = response.data

    // 模拟响应
    aiResponse.value = '正在处理您的请求...'

    // 清空输入和文件列表
    inputText.value = ''
    fileList.value = []
  } catch (error) {
    ElMessage.error('发送失败，请重试')
    console.error(error)
  }
}

// 添加删除文件的方法
const removeFile = (file) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
}
</script>

<template>
  <div class="chat-container">
    <!-- 左侧输入区域 -->
    <div class="input-section">
      <!-- 文本输入框 -->
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="12"
        placeholder="请输入文本、网址、arXiv链接或粘贴图片秒翻"
        resize="none"
        class="main-input"
      />

      <!-- 底部区域 -->
      <div class="bottom-area">
        <!-- 文件上传区域 -->
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleUpload"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :limit="1"
          :multiple="false"
          :show-file-list="false"
        >
          <div class="upload-content">
            <el-icon class="upload-icon"><upload-filled /></el-icon>
            <div class="upload-text">
              <span>点击或拖拽上传文件</span>
              <div class="file-types">
                <span class="file-type"
                  >支持 PDF、Word、PPT、Excel、TXT、图片等格式</span
                >
              </div>
            </div>
          </div>
        </el-upload>

        <!-- 只保留底部的文件信息显示 -->
        <div class="file-list" v-if="fileList.length > 0">
          <div class="file-item">
            <span class="file-name">{{ fileList[0].name }}</span>
            <el-button
              type="danger"
              link
              @click="removeFile(fileList[0])"
              class="remove-btn"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 发送按钮 -->
      <el-button type="primary" @click="sendMessage" class="send-btn">
        解析
      </el-button>
    </div>

    <!-- 右侧响应区域 -->
    <div class="response-section">
      <div class="response-content">
        {{ aiResponse || '等待接收响应...' }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-container {
  display: flex;
  gap: 20px;
  height: 100%;
  padding: 20px;
}

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #dcdfe6;

  .main-input {
    flex: 1;

    :deep(.el-textarea__inner) {
      height: calc(100% - 120px);
      min-height: 300px;
      border: none;
      resize: none;
      padding: 15px;
      padding-bottom: 120px;
      box-shadow: none;
    }
  }
}

.bottom-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
}

.upload-area {
  width: 100%;
  height: 100px;
  display: block;

  :deep(.el-upload) {
    width: 100%;
    height: 100%;
    display: block;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    height: 100%;
    transition: background-color 0.3s;
    border: none;
    border-radius: 0 0 8px 8px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

:deep(.el-upload--text) {
  width: 100%;
  height: 100%;
  margin: 0;
  display: block;
}

.upload-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  width: 100%;
}

.upload-icon {
  font-size: 24px;
  color: #409eff;
}

.upload-text {
  text-align: center;
  color: #606266;

  .file-types {
    margin-top: 5px;
    font-size: 12px;
    color: #909399;
  }
}

.send-btn {
  position: absolute;
  right: 20px;
  bottom: 120px;
  background-color: #6b8ff7;
  border-color: #6b8ff7;
  border-radius: 20px;
  padding: 8px 20px;
  z-index: 1;

  &:hover {
    background-color: #5a7ce6;
    border-color: #5a7ce6;
  }
}

.response-section {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
}

.response-content {
  height: 100%;
  overflow-y: auto;
}

.file-list {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;

  .file-name {
    color: #606266;
    font-size: 14px;
    // 文件名过长时显示省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80%;
  }

  .remove-btn {
    font-size: 14px;
    padding: 0;

    &:hover {
      color: #f56c6c;
    }
  }
}

// 调整上传区域的圆角，只有在没有文件时才显示底部圆角
.upload-area {
  :deep(.el-upload-dragger) {
    border-radius: 0 0 8px 8px;
  }
}

// 当有文件时移除上传区域的底部圆角
.file-list + .upload-area {
  :deep(.el-upload-dragger) {
    border-radius: 0;
  }
}
</style>
