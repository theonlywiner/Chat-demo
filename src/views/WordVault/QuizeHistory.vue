<template>
  <div class="history-container">
    <div class="history-title">题目历史记录</div>
    <div class="history-search-bar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="default"
        style="width: 180px; margin-right: 16px"
      />
      <el-input
        v-model="searchWord"
        placeholder="搜索词语..."
        size="default"
        style="flex: 1; min-width: 320px; margin-right: 16px"
        @keyup.enter="handleSearch"
      />
      <el-button
        type="primary"
        size="default"
        style="min-width: 90px"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </div>
    <el-table
      :data="rows"
      style="width: 100%"
      v-loading="loading"
      size="default"
      class="history-table"
      header-cell-class-name="history-table-header"
    >
      <el-table-column prop="sessionId" label="Session ID" width="220" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="word" label="词语" width="100" />
      <el-table-column prop="generatedAt" label="生成时间" width="160" />
      <el-table-column label="操作">
        <template #default="scope">
          <div class="history-table-actions">
            <el-button size="default" @click="handleSee(scope.row)">
              查看
            </el-button>
            <el-button
              size="default"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper, ->, total"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handlePageChange"
      class="history-pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getQuestionsHistory, deleteQuestionsHistory } from '@/api/aiGenerate'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const rows = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(6)
const loading = ref(false)
const dateRange = ref([])
const searchWord = ref('')

async function fetchData() {
  loading.value = true
  try {
    let startTime = ''
    let endTime = ''
    if (dateRange.value && dateRange.value.length === 2) {
      // 格式化为 'YYYY-MM-DD 00:00:00' 和 'YYYY-MM-DD 23:59:59'
      const pad = (n) => (n < 10 ? '0' + n : n)
      const format = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      startTime = format(dateRange.value[0]) + ' 00:00:00'
      endTime = format(dateRange.value[1]) + ' 23:59:59'
    }
    const res = await getQuestionsHistory(
      page.value,
      pageSize.value,
      startTime,
      endTime,
      searchWord.value
    )
    if (res && res.rows) {
      rows.value = res.rows
      total.value = res.total
    } else {
      rows.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

function handlePageChange(val) {
  page.value = val
  fetchData()
}

function handleSearch() {
  page.value = 1
  fetchData()
}

function handleSee(row) {
  router.push({ path: '/quiz', query: { sessionId: row.sessionId } })
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteQuestionsHistory(row.sessionId)
      if (res === '删除成功') {
        ElMessage.success('删除成功')
        fetchData()
      } else {
        ElMessage.error(res.error || '删除失败')
      }
    })
    .catch(() => {})
}

onMounted(fetchData)
</script>

<style scoped>
.history-container {
  max-width: 1000px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 24px 40px 24px;
  min-height: 60vh;
}
.history-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  color: #1e90ff;
}
.history-search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  gap: 8px;
}
.history-table {
  font-size: 15px;
}
.history-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.history-table-header {
  background-color: #f5f7fa;
  color: #333;
  font-weight: 500;
}
.history-table-actions {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: center;
}
</style>
