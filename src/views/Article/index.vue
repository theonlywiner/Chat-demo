<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getbooksList } from '@/api/article'
import { useArticle } from '@/stores/article'

const router = useRouter()
const books = ref([])
const loading = ref(false)
const articleStore = useArticle() //用于缓存列表

const handleClick = (id) => {
  console.log(books.value[0])

  router.push({
    name: 'prodetail',
    params: { id: id },
    query: { page: 'Article' }
  })
}

onMounted(async () => {
  loading.value = true

  if (articleStore.getPageState() && articleStore.books_List.length > 0) {
    books.value = articleStore.books_List
  } else {
    books.value = await getbooksList()
    articleStore.savePageState(books.value)
  }

  loading.value = false
})
</script>

<template>
  <div class="container" v-loading="loading">
    <div class="content">
      <header class="header">
        <h1 class="title">识典古籍</h1>
      </header>
      <main class="main">
        <div
          v-for="book in books"
          :key="book.id"
          class="book-container"
          @click="handleClick(book.chapterFirstId)"
        >
          <div class="book-shadow">
            <div class="book">
              <div class="book-cover">
                <div class="book-inner">
                  <span class="book-title">{{ book.title }}</span>
                </div>
              </div>
              <h3 class="book-name">{{ book.title }}</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 基础样式 */
.container {
  min-height: 100vh;
  background: #ffffff;
}

.content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  text-align: center;
  padding: 3rem 0;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

/* 主内容区布局 */
.main {
  display: grid;
  gap: 2.5rem;
  padding-bottom: 4rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* 书籍卡片容器 */
.book-container {
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.3s;
}

.book-shadow {
  position: relative;
  transform-style: preserve-3d;
}

.book-shadow::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 10%;
  width: 80%;
  height: 20px;
  background: rgba(44, 62, 80, 0.08);
  filter: blur(12px);
  transition: all 0.3s ease;
  z-index: -1;
}

/* 书籍本体样式 */
.book {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.book:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.book:hover .book-cover {
  transform: scale(1.02);
}

/* 书籍封面 */
.book-cover {
  width: 100%;
  height: 320px;
  margin: 0 auto 1.5rem;
  background: #f3efe0;
  border-radius: 6px;
  border: 1px solid #eee;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-inner {
  width: 78%;
  height: 78%;
  border: 2px solid #e0e0e0;
  background: #fff8dc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 竖排文字样式 */
.book-title {
  color: #8b4513;
  font-weight: 600;
  font-size: 1.8rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.1em;
  line-height: 1.6;
  padding: 0.5em 0;
  text-align: center;
}

/* 书籍名称 */
.book-name {
  color: #34495e;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 1rem 0 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content {
    padding: 0 1.5rem;
  }

  .main {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .book-cover {
    height: 280px;
  }

  .book-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 0 1rem;
  }

  .header {
    padding: 2rem 0;
  }

  .main {
    grid-template-columns: 1fr;
  }

  .book {
    padding: 1rem;
  }

  .book-name {
    font-size: 1rem;
  }
}
</style>
