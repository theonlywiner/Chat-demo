<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { getDailyPoem, DEFAULT_POEM } from '@/api/poem'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const searchType = ref('content')

const dailyPoem = ref({
  title: '',
  author: '',
  content: [],
  dynasty: '',
  background: ''
})

const updateTimer = ref(null)

const handleMoreClick = () => {
  if (!userStore.isLogin) {
    router.push('/login')
  } else {
    router.push({
      path: '/article/PoemSearch',
      query: { 
        keyword: dailyPoem.value.title,
        autoSearch: 'true'
      }
    })
  }
}

const searchTypes = [
  { value: 'content', label: '内容搜索', path: '/article/search_keyword' },
  { value: 'poem', label: '古诗搜索', path: '/article/PoemSearch' },
  { value: 'article', label: '古文搜索', path: '/article/search' }
]

const clearCache = () => {
  // 先查看当前缓存
  const currentCache = localStorage.getItem('daily_poem_cache')
  console.log('清除前的缓存:', currentCache ? JSON.parse(currentCache) : '无缓存')
  
  // 清除缓存
  localStorage.removeItem('daily_poem_cache')
  console.log('缓存已清除')
  
  // 重新获取数据
  fetchDailyPoem()
  ElMessage.success('已重新获取每日一诗')
}

// 获取每日一诗数据
const fetchDailyPoem = async () => {
  try {
    const response = await getDailyPoem()
    console.log('API 返回数据:', response)
    
    // 检查是否使用了缓存
    const currentCache = localStorage.getItem('daily_poem_cache')
    if (currentCache) {
      console.log('使用了缓存数据')
    } else {
      console.log('使用了新的API数据')
    }
    
    if (response.code === 1) {
      // 处理内容：先取数组第一项，去除HTML标签，然后按标点分割
      const rawContent = response.data.content[0].replace(/<[^>]+>/g, '').trim()
      const contentArray = rawContent
        .split(/[。？！]/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line + '。')

      console.log('Processed Content:', contentArray)

      dailyPoem.value = {
        title: response.data.title || '无题',
        author: response.data.author || '佚名',
        content: contentArray,
        dynasty: response.data.dynasty || '未知',
        background: response.data.background || '暂无创作背景信息'
      }

      console.log('Daily Poem Value:', dailyPoem.value)
    } else {
      console.error('获取每日一诗失败:', response.msg)
      dailyPoem.value = DEFAULT_POEM
    }
  } catch (error) {
    console.error('获取每日一诗失败:', error)
    dailyPoem.value = DEFAULT_POEM
  }
}

onMounted(() => {
  fetchDailyPoem()
})

onUnmounted(() => {
  if (updateTimer.value) {
    window.clearInterval(updateTimer.value)
    updateTimer.value = null
  }
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const selectedType = searchTypes.find(type => type.value === searchType.value)
    if (selectedType) {
      router.push({
        path: selectedType.path,
        query: { 
          keyword: searchQuery.value,
          autoSearch: 'true'
        }
      })
    }
  }
}

const handleEnterClick = () => {
  router.push('/article/channel')
}
</script>

<template>
  <div class="dashboard-container">
    <div class="content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <img src="@/assets/empty.png" alt="Logo" class="logo-image" />
        <h1 class="logo-text">古文鉴赏</h1>
      </div>

      <!-- 中央搜索区域 -->
      <div class="center-section">
        <div class="search-container">
          <div class="search-wrapper">
            <div class="search-type-selector">
              <select v-model="searchType" class="type-select">
                <option v-for="type in searchTypes" 
                        :key="type.value" 
                        :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            <input 
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="'输入' + searchTypes.find(t => t.value === searchType)?.label.slice(0, 2) + '关键词...'"
              @keyup.enter="handleSearch"
            />
            <button class="search-button" @click="handleSearch">
              <i class="search-icon"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 导航区域 - 改为单个按钮 -->
      <div class="nav-section">
        <button class="enter-button" @click="handleEnterClick">
          进入系统
        </button>
      </div>

      <!-- 底部内容区域 -->
      <div class="bottom-section">
        <!-- 左侧每日一诗 -->
        <div class="daily-poem-section">
          <h2 class="section-title">每日一诗</h2>
          <div class="poem-card">
            <div class="poem-header">
              <h3 class="poem-title">{{ dailyPoem.title || '加载中...' }}</h3>
              <div class="poem-info">
                <span class="poem-dynasty">{{ dailyPoem.dynasty || '未知' }}</span>
                <span class="poem-author">{{ dailyPoem.author || '佚名' }}</span>
              </div>
            </div>
            <div class="poem-content">
              <template v-if="dailyPoem.content && dailyPoem.content.length > 0">
                <p v-for="(line, index) in dailyPoem.content" 
                   :key="index" 
                   class="poem-line"
                   :style="{ color: '#333' }">
                  {{ line }}
                </p>
              </template>
              <template v-else>
                <p class="poem-line" style="color: #666;">加载中...</p>
              </template>
            </div>
            <div class="refresh-button-container">
              <button class="refresh-button" @click="clearCache">
                <i class="refresh-icon"></i>
                刷新诗词
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧背景 -->
        <div class="poem-tips">
          <div class="tips-card">
            <h3 class="tips-title">创作背景</h3>
            <div class="tips-content">
              <div class="tips-item">
                <p class="text-content">{{ dailyPoem.background }}</p>
              </div>
              <button class="more-button" @click="handleMoreClick">了解更多</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dashboard-container {
  min-height: 100vh;
  width: 100%;
  background: 
    linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url('http://121.40.247.80:5173/src/imgs/img2.png') no-repeat center center;
  background-size: cover;
  padding: 10vh 0;
}

.content {
  position: relative;
  width: 90%;
  max-width: 1200px;
  min-height: 80vh;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
}

.logo-section {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .logo-image {
    height: 40px;
    width: auto;
  }

  .logo-text {
    font-size: 1.5rem;
    color: #333;
    font-weight: 500;
  }
}

.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.nav-section {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 100;
}

.enter-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2563eb;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.bottom-section {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.daily-poem-section {
  flex: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: normal;
}

.poem-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.poem-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.poem-title {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.poem-info {
  font-size: 1rem;
  color: #666;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.poem-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 0;
  overflow-y: auto;
}

.poem-line {
  font-size: 1.2rem;
  line-height: 2;
  margin: 0.5rem 0;
  text-align: center;
  color: #333;
  font-weight: normal;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
}

.user-section {
  width: 300px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  text-align: center;
}

.user-details {
  .greeting {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.3rem;
  }

  .username {
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
  }
}

.auth-buttons {
  display: flex;
  justify-content: center;
}

.auth-button {
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &.login {
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  }
}

.poem-tips {
  width: 300px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.tips-card {
  width: 100%;
}

.tips-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tips-content {
  .tips-item {
    margin-bottom: 1rem;
    
    .text-content {
      font-size: 0.95rem;
      color: #333;
      line-height: 1.6;
      margin: 0;
      text-align: justify;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.more-button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
}

.search-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding-left: 0.5rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.search-type-selector {
  position: relative;
  margin-right: 0.5rem;

  &::after {
    content: '';
    height: 24px;
    width: 1px;
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

.type-select {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 1.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;

  &:hover {
    color: #333;
  }
}

.search-input {
  flex: 1;
  padding: 1rem 3.5rem 1rem 0.5rem;
  font-size: 1.1rem;
  border: none;
  background: transparent;
  outline: none;
}

.search-button {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
}

.search-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    width: 7px;
    height: 2px;
    background: #3b82f6;
    transform: rotate(45deg);
    transform-origin: left center;
  }
}

.refresh-button-container {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: #e5e7eb;
    color: #3b82f6;
  }

  .refresh-icon {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    position: relative;
    display: inline-block;
  }
}
</style>
