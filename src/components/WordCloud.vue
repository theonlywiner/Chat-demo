<template>
  <div class="word-cloud-container">
    <!-- 词云弹出提示 -->
    <el-popover
      v-model:visible="popoverVisible"
      placement="top"
      :width="200"
      trigger="manual"
      :show-after="100"
      popper-class="word-meaning-popover"
    >
      <template #default>
        <div class="word-meaning">
          <h4>{{ selectedWord }}</h4>
          <p>{{ wordMeaning }}</p>
        </div>
      </template>
      <template #reference>
        <div class="chart-wrapper">
          <VChart
            :option="wordCloudOption"
            :autoresize="true"
            style="width: 100%; height: 400px"
            @mousemove="handleWordMove"
            @mouseleave="handleChartMouseLeave"
          />
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import 'echarts-wordcloud'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// 注册必要组件
echarts.use([CanvasRenderer, TooltipComponent])

const props = defineProps({
  // 词云数据列表
  wordList: {
    type: Array,
    required: true
    // 数据格式: [{word: string, frequency: number, semanticMeaning?: string}]
  },
  // 配置项
  options: {
    type: Object,
    default: () => ({})
  }
})

// 内部状态
const popoverVisible = ref(false)
const selectedWord = ref('')
const wordMeaning = ref('')
const hideTimer = ref(null)
const wordFrequencyMap = ref({})

// 词云配置
const wordCloudOption = ref({})

// 更新词云配置
const updateWordCloud = () => {
  // 创建词频数据的映射
  wordFrequencyMap.value = props.wordList.reduce((map, item) => {
    map[item.word] = item
    return map
  }, {})

  // 词云配置
  wordCloudOption.value = {
    tooltip: {
      show: true,
      formatter: (params) => `${params.data.name}: 使用${params.data.value}次`
    },
    series: [
      {
        type: 'wordCloud',
        data: props.wordList.map((item) => ({
          name: item.word,
          value: item.frequency
        })),
        ...props.options,
        // 默认配置
        sizeRange: props.options.sizeRange || [20, 80],
        rotationRange: props.options.rotationRange || [0, 45],
        gridSize: props.options.gridSize || 12,
        shape: props.options.shape || 'circle',
        textStyle: {
          color: () => {
            return (
              'rgb(' +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') +
              ')'
            )
          },
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          ...props.options.textStyle
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          },
          ...props.options.emphasis
        }
      }
    ]
  }
}

// 监听数据变化
watch(
  () => props.wordList,
  () => {
    updateWordCloud()
  },
  { deep: true, immediate: true }
)

// 鼠标移动事件
const handleWordMove = (params) => {
  const word = params.data?.name
  const wordData = wordFrequencyMap.value[word]

  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
  }

  if (wordData) {
    selectedWord.value = word
    wordMeaning.value = wordData.semanticMeaning || '暂无释义'
    popoverVisible.value = true
  } else {
    hideTimer.value = setTimeout(() => {
      popoverVisible.value = false
    }, 1000)
  }
}

// 鼠标离开事件
const handleChartMouseLeave = () => {
  hideTimer.value = setTimeout(() => {
    popoverVisible.value = false
  }, 1000)
}
</script>

<style scoped>
.word-cloud-container {
  width: 100%;
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
