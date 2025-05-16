<script setup>
import { ref, watch, onMounted } from 'vue'
// import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'

// 注册必要组件
use([CanvasRenderer, TooltipComponent])

const props = defineProps({
  wordList: {
    type: Array,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['wordClick'])

// 内部状态
const wordCloudOption = ref({})
const chartInitialized = ref(false)

// 更新词云配置
const updateWordCloud = () => {
  wordCloudOption.value = {
    tooltip: {
      show: true,
      formatter: (params) => `${params.data.name}: ${params.data.value}首`
    },
    series: [
      {
        type: 'wordCloud',
        shape: props.options.shape || 'circle',
        sizeRange: props.options.sizeRange || [24, 100],
        rotationRange: props.options.rotationRange || [-45, 45],
        rotationStep: 45,
        gridSize: props.options.gridSize || 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
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
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
            // 移除 fontSize 配置，保持原有大小
          }
        },
        data: props.wordList.map((item) => ({
          name: item.dynasty,
          value: item.count,
          dynastyId: item.dynastyId, // 保存朝代ID
          itemStyle: {
            color: item.color
          }
        }))
      }
    ]
  }
}

// 处理点击事件
const handleChartClick = (params) => {
  if (params.data) {
    emit('wordClick', {
      dynasty: params.data.name,
      dynastyId: params.data.dynastyId,
      count: params.data.value
    })
  }
}

// 监听数据变化
watch(
  () => props.wordList,
  () => {
    if (chartInitialized.value) {
      updateWordCloud()
    }
  },
  { deep: true, immediate: true }
)

// 添加 onMounted 钩子
onMounted(() => {
  chartInitialized.value = true
  updateWordCloud()
})
</script>

<template>
  <div class="word-cloud-container">
    <div class="chart-wrapper">
      <v-chart
        :option="wordCloudOption"
        :autoresize="true"
        style="width: 100%; height: 600px"
        @click="handleChartClick"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.word-cloud-container {
  width: 100%;
  height: 600px; // 增加容器高度
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px; // 添加最小高度
}

:deep(.el-dialog__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}
</style>
