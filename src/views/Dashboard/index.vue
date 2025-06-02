<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getDailyPoem, DEFAULT_POEM } from '@/api/poem'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const searchType = ref('content')
const isNavExpanded = ref(false)

const dailyPoem = ref({
  title: '',
  author: '',
  content: [],
  dynasty: ''
})

const updateTimer = ref(null)

// 计算用户登录状态和问候语
const isLoggedIn = computed(() => userStore.isLogin)
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

const handleLogin = () => {
  router.push('/login')
}

const searchTypes = [
  { value: 'content', label: '内容搜索', path: '/article/search_keyword' },
  { value: 'poem', label: '古诗搜索', path: '/article/PoemSearch' },
  { value: 'article', label: '古文搜索', path: '/article/search' }
]

const navItems = [
  { name: '古籍大全', path: '/article/channel', icon: '📚'},
  { name: '古文搜索', path: '/article/search', icon: '🔍' },
  { name: '古诗搜索', path: '/article/PoemSearch', icon: '📜' },
  { name: '内容搜索', path: '/article/search_keyword', icon: '📖' },
  { name: '解析', path: '/article/question', icon: '💡' },
  { name: 'AI对话', path: '/article/ai_chat', icon: '🤖' },
  { name: '可视化', path: '/article/visualization', icon: '📊' }
]

// 获取每日一诗数据
const fetchDailyPoem = async () => {
  try {
    const response = await getDailyPoem()
    console.log('API Response:', response)
    
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
        dynasty: response.data.dynasty || '未知'
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
  // 设置定时器，每小时检查一次是否需要更新诗词
  updateTimer.value = window.setInterval(fetchDailyPoem, 3600000) // 3600000ms = 1小时
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
      router.push(`${selectedType.path}?keyword=${encodeURIComponent(searchQuery.value)}`)
    }
  }
}

const handleNavClick = (path) => {
  router.push(path)
}

const toggleNav = () => {
  isNavExpanded.value = !isNavExpanded.value
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

      <!-- 导航区域 -->
      <div class="nav-section">
        <button class="nav-toggle" @click="toggleNav">
          {{ isNavExpanded ? '收起 ↑' : '菜单 ↓' }}
        </button>
        <div class="nav-container" :class="{ 'expanded': isNavExpanded }">
          <div 
            v-for="item in navItems" 
            :key="item.path"
            class="nav-item"
            @click="handleNavClick(item.path)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.name }}</span>
          </div>
        </div>
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
          </div>
        </div>

        <!-- 右侧用户区域 -->
        <div class="user-section">
          <template v-if="isLoggedIn">
            <div class="user-info">
              <div class="user-details">
                <div class="greeting">{{ greeting }}，</div>
                <div class="username">{{ userStore.userName }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="auth-buttons">
              <button class="auth-button login" @click="handleLogin">登录</button>
            </div>
          </template>
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
    url('https://www.natfrp.com/static/bg1.jpg') no-repeat center center;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 100;
}

.nav-toggle {
  background: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 100px;

  &:hover {
    background: #f8f9fa;
    color: #3b82f6;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
}

.nav-container {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;

  &.expanded {
    max-height: 400px;
    opacity: 1;
    padding: 0.5rem;
    pointer-events: auto;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  background: #fff;

  &:not(:last-child) {
    margin-bottom: 0.3rem;
  }

  .nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }

  .nav-text {
    font-size: 0.95rem;
    color: #666;
    white-space: nowrap;
  }

  &:hover {
    background: #f8f9fa;

    .nav-text {
      color: #3b82f6;
    }
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
</style>
