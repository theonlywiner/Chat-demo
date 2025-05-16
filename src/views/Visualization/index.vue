<template>
  <div class="visualization-container">
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true">
        <!-- 作者选择 -->
        <el-form-item label="选择作者">
          <el-select
            v-model="selectedAuthor"
            placeholder="请选择作者"
            clearable
            filterable
            :filter-method="filterAuthor"
            style="width: 200px"
            @change="handleAuthorChange"
          >
            <el-option
              v-for="author in filteredAuthorList"
              :key="author.id"
              :label="author.name"
              :value="author.id"
            >
              <!-- 添加作者朝代信息 -->
              <span>{{ author.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ author.dynasty }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 朝代选择 -->
        <el-form-item label="选择朝代">
          <el-select
            v-model="selectedDynasty"
            placeholder="请选择朝代"
            clearable
            style="width: 200px"
            @change="handleDynastyChange"
          >
            <el-option
              v-for="dynasty in dynastyList"
              :key="dynasty"
              :label="dynasty"
              :value="dynasty"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 作者信息展示 -->
    <div class="author-info" v-if="selectedAuthor">
      <h2>{{ displayAuthorName }}的创作统计</h2>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="作品总数">
          {{ authorStats.totalWorks }}
        </el-descriptions-item>
        <el-descriptions-item label="最常用词语">
          {{ authorStats.mostUsedWord }}
        </el-descriptions-item>
        <el-descriptions-item label="创作朝代">
          {{ authorStats.dynasty }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 词云图 -->
    <div class="chart-section">
      <h2>
        {{
          (selectedDynasty ? selectedDynasty + '朝代' : '') +
          (displayAuthorName ? displayAuthorName + '作者' : '') +
          '词语使用频率词云'
        }}
      </h2>
      <WordCloud
        :word-list="wordFrequencyList"
        :options="{
          sizeRange: [20, 80],
          rotationRange: [0, 45],
          shape: 'circle'
        }"
      />
    </div>

    <!-- 柱形图 -->
    <div class="chart-section">
      <h2>高频词语TOP10统计</h2>
      <VChart
        :option="barChartOption"
        :autoresize="true"
        style="width: 100%; height: 400px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import 'echarts-wordcloud'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  getWordFrequency,
  getAllAuthors,
  getAllDynasty,
  getAuthorInfo
} from '@/api/visualize'
import WordCloud from '@/components/WordCloud.vue'

// 注册必要组件
echarts.use([
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart
])

// 筛选条件数据
const selectedDynasty = ref('')
const selectedAuthor = ref('')
const dynastyList = ref([])
const authorList = ref([])
const filteredAuthorList = ref([])

// 图表配置
// const wordCloudOption = ref({})
const barChartOption = ref({})

// 作者统计数据
const authorStats = ref({
  totalWorks: 0,
  mostUsedWord: '',
  dynasty: ''
})

// 在 script setup 中添加新的响应式变量
const wordFrequencyMap = ref({}) // 用于存储词频数据的映射

// 在 script setup 中添加新的响应式变量用于显示
const displayAuthorName = ref('') // 用于显示作者名称

const hideTimer = ref(null)

// 词频列表
const wordFrequencyList = ref([])

// 加载词云数据
const loadWordCloud = async () => {
  try {
    // 获取词频统计数据
    console.log('selectedAuthor:', selectedAuthor.value)
    const response = await getWordFrequency(selectedAuthor.value)

    const wordFrequency = response.data.wordCloudItemList

    // 创建词频数据的映射
    wordFrequencyMap.value = wordFrequency.reduce((map, item) => {
      map[item.word] = item
      return map
    }, {})

    wordFrequencyList.value = response.data.wordCloudItemList

    // 柱形图配置 - 展示频率最高的10个词
    barChartOption.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: wordFrequency.slice(0, 10).map((item) => item.word),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '使用频率'
      },
      series: [
        {
          name: '使用频率',
          type: 'bar',
          data: wordFrequency.slice(0, 10).map((item) => item.frequency),
          itemStyle: {
            color: function () {
              return `rgb(${Math.round(Math.random() * 160)},${Math.round(Math.random() * 160)},${Math.round(Math.random() * 160)})`
            }
          }
        }
      ]
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 处理筛选条件变化
// const handleFilterChange = () => {
//   loadWordCloud()
// }

// 获取作者列表
const getAuthorList = async () => {
  try {
    const res = await getAllAuthors()
    authorList.value = res.data
    filteredAuthorList.value = res.data // 初始化过滤列表
  } catch (error) {
    console.error('获取作者列表失败:', error)
  }
}

// 获取朝代列表
const getDynastyList = async () => {
  try {
    const res = await getAllDynasty()
    dynastyList.value = res.data.dynasty
  } catch (error) {
    console.error('获取朝代列表失败:', error)
  }
}

// 获取作者统计信息
const getAuthorStats = async (id) => {
  try {
    const response = await getAuthorInfo(id)
    // console.log('作者统计信息:', response)
    authorStats.value = response.data
  } catch (error) {
    console.error('获取作者统计信息失败:', error)
  }
}

// 处理作者选择变化
const handleAuthorChange = async (id) => {
  console.log('handleAuthorChange:', id)
  if (id) {
    // 根据 id 查找对应的作者信息
    const author = authorList.value.find((a) => a.id === id)
    if (author) {
      displayAuthorName.value = author.name
    }
    getAuthorStats(id)
  } else {
    displayAuthorName.value = ''
    authorStats.value = {
      totalWorks: 0,
      mostUsedWord: '',
      dynasty: ''
    }
  }
  loadWordCloud()
}

// // 处理朝代选择变化
// const handleDynastyChange = (value) => {
//   loadWordCloud()
// }

// 过滤方法
const filterAuthor = (query) => {
  if (query) {
    // 如果有输入内容，则过滤匹配的作者
    filteredAuthorList.value = authorList.value.filter(
      (author) =>
        author.name.toLowerCase().includes(query.toLowerCase()) ||
        author.dynasty.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    // 如果没有输入内容，显示所有作者
    filteredAuthorList.value = authorList.value
  }
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (hideTimer.value) {
    clearTimeout(hideTimer)
  }
})

onMounted(() => {
  loadWordCloud()
  getAuthorList()
  getDynastyList() // 添加获取朝代列表
})
</script>

<style scoped>
.visualization-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 20px;
}

.author-info {
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.chart-section {
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 20px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
}

.word-meaning {
  padding: 8px;
  transition: all 0.3s ease-in-out;
}

.word-meaning h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.word-meaning p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.word-meaning-popover) {
  max-width: 300px;
  transition: opacity 0.3s ease-in-out;
}
</style>
