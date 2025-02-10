<script setup>
import { ArrowUp } from '@element-plus/icons-vue'
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getArticleDetail } from '@/api/searchArticle'
import { ElTree } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const articleDetail = ref({
  title: '',
  author: '',
  dynasty: '',
  content: '',
  content_list: '',
  translation: '',
  notes: ''
})

// 新增导航树数据
const navTreeData = ref([])

// 默认选中第一个章节
const defaultSelectedKey = ref()

const treeRef = ref()

//每次点击导航树节点时触发
const handleNodeClick = (node) => {
  if (node.children == null) {
    //把路由部分的route.params.id改成当前点击的id
    //重新渲染页面
    const page = route.query.page
    router.push({
      name: 'prodetail',
      params: { id: node.id },
      query: { page: page }
    })
    get_ArticleDetail(node.id)
  }
}

// 获取文章详情
const get_ArticleDetail = async (id) => {
  loading.value = true
  try {
    // console.log(id)

    // 这里调用后端API获取数据
    const res = await getArticleDetail(id)

    articleDetail.value = res.result
    navTreeData.value = res.navTreeData

    defaultSelectedKey.value = id
    // 等待 DOM 更新后手动设置当前选中节点
    nextTick(() => {
      treeRef.value?.setCurrentKey(defaultSelectedKey.value)
    })
    // console.log('文章详情:', res)
  } catch (error) {
    console.error('获取文章详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理返回
const handleBack = () => {
  // 返回时带上来源标记
  // router.push({
  //   path: '/article/search',
  //   query: { from: 'detail' }
  // })
  console.log(route.query.page)
  if (route.query.page === 'Search') {
    router.push({
      path: '/article/search',
      query: { from: 'detail' }
    })
  } else if (route.query.page === 'Article') {
    router.push({
      path: '/article/channel',
      query: { from: 'detail' }
    })
  }
}

onMounted(() => {
  const id = route.params.id
  // 若要确保转换成功且是整数，使用 parseInt

  if (id) {
    get_ArticleDetail(id)
  }
})
</script>

<template>
  <div class="detail-container">
    <!-- 返回按钮 -->
    <div class="top-bar">
      <div class="back-button" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 新增左侧导航 -->
      <div class="nav-tree">
        <!-- props 指定节点标签为节点对象的某个属性值 -->
        <!-- current-node-key 当前选中的节点 -->
        <!-- default-expand-all 是否默认展开所有节点 默认false-->
        <!-- highlight-current 是否高亮 -->
        <el-tree
          v-loading="loading"
          ref="treeRef"
          :data="navTreeData"
          node-key="id"
          :current-node-key="defaultSelectedKey"
          :props="{ label: 'label' }"
          auto-expand-parent
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>

      <el-backtop :bottom="100" :right="100">
        <el-icon><ArrowUp /></el-icon>
      </el-backtop>
      <!-- 文章详情 -->
      <div class="article-detail" v-loading="loading">
        <div class="detail-header">
          <h1 class="title">{{ articleDetail.title }}</h1>
          <div class="meta">
            <span class="dynasty">{{ articleDetail.dynasty }}</span>
            <span class="author">{{ articleDetail.author }}</span>
          </div>
        </div>

        <el-divider />

        <div class="content-section">
          <div class="section">
            <h3>原文 + 译文</h3>
            <li
              v-for="(item, index) in articleDetail.content_list"
              :key="index"
            >
              <div class="text text_ancient">{{ item.ancient_content }}</div>
              <div class="text text_modern">{{ item.modern_content }}</div>
            </li>
          </div>

          <div class="section">
            <h3>注释</h3>
            <div class="text">{{ articleDetail.notes }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail-container {
  // 保持原有样式不变
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  // 新增布局
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.nav-tree {
  background: #fff;
  border-right: 1px solid #ebeef5;
  height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 10px;

  :deep(.el-tree) {
    background: transparent;

    .el-tree-node__content {
      height: 36px;
      &:hover {
        background: #f5f7fa;
      }
    }

    .is-current > .el-tree-node__content {
      background-color: #f0f7ff;
      .el-tree-node__label {
        color: #409eff;
      }
    }
  }
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #909399;
  margin-bottom: 20px;

  &:hover {
    color: var(--el-color-primary);
  }
}

// .up-botton {
//   height: 100%;
//   width: 100%;
//   background-color: var(--el-bg-color-overlay);
//   box-shadow: var(--el-box-shadow-lighter);
//   text-align: center;
//   line-height: 40px;
//   color: #1989fa;
// }

.article-detail {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .detail-header {
    text-align: center;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      color: #303133;
      margin-bottom: 10px;
    }

    .meta {
      color: #909399;
      font-size: 14px;

      .dynasty,
      .author {
        margin: 0 10px;
      }
    }
  }

  .content-section {
    .section {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        color: #303133;
        margin-bottom: 15px;
        padding-left: 10px;
        border-left: 4px solid var(--el-color-primary);
      }

      .text {
        line-height: 1.8;
        text-align: justify;
      }

      .text_ancient {
        color: #080807;
        font-size: 18px;
      }

      .text_modern {
        color: #898888;
        font-size: 18px;
      }
    }
  }
}
</style>
