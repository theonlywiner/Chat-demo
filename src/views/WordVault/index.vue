<template>
  <div class="word-vault-page">
    <div class="alpha-sidebar">
      <div
        v-for="item in alphaList"
        :key="item.initial === null ? 'all' : item.initial"
        :class="['alpha-item', { active: selectedAlpha === item.initial }]"
        @click="onAlphaClick(item.initial)"
      >
        {{ item.displayName }}
      </div>
    </div>
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索词语..."
        class="search-input"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button
        class="search-btn"
        type="primary"
        :style="{
          background: 'rgba(30, 144, 255, 0.3)', // 透明淡蓝色
          border: 'none',
          boxShadow: 'none'
        }"
        @click="handleSearch"
        circle
      >
        <el-icon><Search /></el-icon>
      </el-button>
    </div>
    <div class="main-content">
      <!-- 词图区域 -->
      <D3WordGraph :wordList="wordList" />
      <!-- 右侧唯一词详情区域，使用WordSimpleCard -->
      <div v-if="wordList.length === 1" class="single-word-list-article">
        <div class="word-card-content">
          <WordSimpleCard
            :word="wordList[0].word"
            :meanings="wordList[0].meaningsPoemsList"
            @show-detail="onSimpleCardDetail"
          />
        </div>
        <el-button
          type="primary"
          class="bottom-btn"
          :disabled="isGenerating"
          @click="handleGenerateQuiz"
        >
          {{ isGenerating ? '正在出题...' : '一键出题' }}
        </el-button>
      </div>
      <!-- 详情弹窗组件 -->
      <WordDetailDialog
        v-model:show="showDetail"
        :node="detailNode"
        :meaning="detailMeaning"
        top="32px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import D3WordGraph from './D3WordGraph.vue'
import WordSimpleCard from './Components/WordSimpleCard.vue'
import WordDetailDialog from '@/components/WordDetailDialog.vue'
import { queryWordInfo, queryWordClass } from '@/api/word'
import { aiGenerateQuestions } from '@/api/aiGenerate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchText = ref('')
const wordList = ref([])
const alphaList = ref([])
const selectedAlpha = ref(null)
const isGenerating = ref(false)
// const lastGenerateTime = ref(0) // 已不再需要
const COOLDOWN_MS = 5 * 60 * 1000 // 5分钟

// 详情弹窗相关
const showDetail = ref(false)
const detailNode = ref(null)
const detailMeaning = ref(null)

// 获取字母分类
async function fetchAlphaList() {
  const res = await queryWordClass()
  if (res && res.data) {
    alphaList.value = res.data
  }
}

// 处理搜索
async function handleSearch() {
  try {
    let initial = null
    let priority = null
    // 判断当前选中的筛选项
    if (selectedAlpha.value === null || /^[A-Z]$/.test(selectedAlpha.value)) {
      // "全部" 或字母筛选，传 initial
      initial = selectedAlpha.value
      priority = null
    } else if (
      ['高频重点词', '中频重要词', '低频重要词'].includes(selectedAlpha.value)
    ) {
      // 高频/中频/低频，传 priority
      initial = null
      priority = selectedAlpha.value
    }
    const result = await queryWordInfo(
      searchText.value || null,
      initial,
      priority
    )
    if (result?.data) {
      wordList.value = result.data
    }
  } catch (error) {
    console.error('查询失败:', error)
  }
}

function onAlphaClick(initial) {
  selectedAlpha.value = initial
  handleSearch()
}

// 页面加载时
onMounted(() => {
  fetchAlphaList()
  handleSearch()
})

function onSimpleCardDetail(meaning) {
  detailNode.value = wordList.value[0]
  detailMeaning.value = meaning
  showDetail.value = true
}

async function handleGenerateQuiz() {
  // 判断是否登录
  const userStr = localStorage.getItem('user')
  let token = ''
  if (userStr) {
    try {
      token = JSON.parse(userStr).token
    } catch {
      token = ''
    }
  }
  if (!token) {
    // 弹出选择框
    ElMessageBox.confirm('需要登录才能出题，是否前往登录？', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: true,
      closeOnClickModal: false,
      closeOnPressEscape: false
    })
      .then(() => {
        router.push('/login')
      })
      .catch(() => {})
    return
  }
  // 读取本地冷却时间
  const lastTime = Number(
    localStorage.getItem('wordvault_last_generate_time') || 0
  )
  const now = Date.now()
  if (!wordList.value.length || isGenerating.value) return
  if (lastTime && now - lastTime < COOLDOWN_MS) {
    const left = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000)
    ElMessage.info(`请${left}秒后再试，防止频繁出题~`)
    return
  }
  isGenerating.value = true
  try {
    // 右上角loading消息，手动关闭
    const loadingMsg = ElMessage({
      message: '正在为您生成题目，请稍候...',
      type: 'info',
      duration: 0,
      showClose: true,
      customClass: 'quiz-success-message',
      offset: 20,
      grouping: true,
      appendTo: document.body
    })
    const res = await aiGenerateQuestions(wordList.value[0])
    if (res && res.success !== false) {
      localStorage.setItem('wordvault_last_generate_time', String(Date.now()))
      // 关闭loading消息
      loadingMsg.close && loadingMsg.close()
      // 右上角灰色提示框，带跳转链接
      ElMessage({
        message: `出题成功，<a style='color:#409EFF;cursor:pointer;text-decoration:underline' id='quiz-link'>快来看看吧!</a>`,
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 0,
        showClose: true,
        customClass: 'quiz-success-message',
        offset: 20,
        grouping: true,
        appendTo: document.body
      })
      setTimeout(() => {
        const link = document.getElementById('quiz-link')
        if (link) {
          link.onclick = () => {
            router.push({
              path: '/quiz',
              query: { sessionId: res } // 直接传递sessionId
            })
            // 主动关闭所有 ElMessage
            ElMessage.closeAll && ElMessage.closeAll()
          }
        }
      }, 100)
      // 你可以用弹窗展示题目内容
      // 例如：ElMessageBox.alert(JSON.stringify(res), 'AI出题结果')
      // console.log('AI出题结果', res)
    } else {
      loadingMsg.close && loadingMsg.close()
      ElMessage.error(res.error || '出题失败')
      console.error(res.error || '出题失败')
    }
  } catch (e) {
    ElMessage.error('出题异常')
    console.error('出题异常', e)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.word-vault-page {
  width: 100%;
  /* 减去顶部导航栏和底部预留空间，避免溢出 */
  height: calc(100vh - 160px);
  /* height: 100vh; */
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}

.alpha-sidebar {
  position: absolute;
  left: 0;
  top: 80px;
  width: 45px; /* 原35px，改为60px，更宽 */
  height: 100%;
  /* height: calc(100vh - 160px - 40px); */
  background: rgba(255, 255, 255, 0.3); /*更透明 */
  border-radius: 12px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  z-index: 20;
  overflow-y: auto; /* 超出可滚动，防止溢出 */
}
.alpha-item {
  width: 100%;
  text-align: center;
  padding: 3px 0; /* 更宽后适当加大内边距 */
  font-size: 12px; /* 字体略大 */
  color: #888;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background 0.2s,
    color 0.2s;
  user-select: none;
}
.alpha-item.active {
  background: #1e90ff;
  color: #fff;
  font-weight: bold;
}
.search-bar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 300px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 5px;
  display: flex;
  align-items: center;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: none !important;
}

.search-btn {
  margin-left: 8px;
  opacity: 1;
  transition: opacity 0.2s;
}
.search-btn:hover {
  background: rgba(30, 144, 255, 0.5) !important;
}

.main-content {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
}

.graph-container {
  /* 固定高度，避免内容撑到底部 */
  height: calc(100vh - 120px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
}

/* 优化唯一词详情区域，顶部上移，内容可滚动，按钮固定底部 */
.single-word-list-article {
  position: absolute;
  right: 32px;
  top: 20px; /* 原80px，向上移动 */
  width: 370px;
  z-index: 10;
  background: none;
  box-shadow: none;
  border-radius: 10px;
  max-height: 85%; /* 顶部40+底部20 */
  display: flex;
  flex-direction: column;
}
.single-word-list-article .word-card-content {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}
.single-word-list-article .bottom-btn {
  flex-shrink: 0;
  width: 100%;
}
</style>
