<template>
  <div class="word-graph-container">
    <div class="canvas-wrapper" ref="canvasWrapper">
      <svg ref="svgContainer" v-show="hasData">
        <g ref="mainGroup"></g>
      </svg>
      <el-empty v-if="!hasData" description="暂无数据" class="d3-empty" />
    </div>
    <!-- 遮罩层 -->
    <div v-if="selectedMeaning" class="overlay" @click="closeDetail"></div>
    <!-- 详情面板 -->
    <transition name="slide-fade">
      <div class="detail-panel" v-if="selectedMeaning">
        <div class="panel-header">
          <h2>
            【{{ selectedNode?.word || '' }}】{{
              selectedNode?.phoneticize || ''
            }}
          </h2>
          <div style="display: flex; gap: 8px; align-items: flex-start">
            <button class="copy-btn" @click="copyDetail">复制</button>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>
        </div>
        <div class="meaning-header">
          <span class="meaning-type">{{ selectedMeaning.type || '释义' }}</span>
        </div>
        <div class="meaning-content" ref="detailContent">
          <p>{{ selectedMeaning.meaning }}</p>
          <div
            class="examples"
            v-if="selectedMeaning.examplesPoemsList?.length"
          >
            <h4>例句：</h4>
            <div
              v-for="example in selectedMeaning.examplesPoemsList"
              :key="example.id"
              class="example-item"
            >
              <p>▶ {{ example.example }}</p>
              <small
                >—— {{ example.source
                }}{{
                  example.grade != null && example.grade !== ''
                    ? ' ' + example.grade
                    : ''
                }}</small
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as d3 from 'd3'
import { ElMessage } from 'element-plus'

const props = defineProps({
  wordList: {
    type: Array,
    required: true
  }
})

// 状态管理
const canvasWrapper = ref(null)
const svgContainer = ref(null)
const selectedMeaning = ref(null)
const selectedNode = ref(null)
const detailContent = ref(null)
let svg = null
let zoom = null
let viewportWidth = 0
let viewportHeight = 0
let cachedLayout = null
let cachedBBox = null

const hasData = computed(() => {
  return Array.isArray(props.wordList) && props.wordList.length > 0
})

// 关闭详情面板
function closeDetail() {
  selectedMeaning.value = null
  selectedNode.value = null
}

const LAYOUT_CONFIG = {
  baseRadius: 190, // 主球体更大
  radiusPerMeaning: 14,
  maxRadius: 280, // 主球最大半径更大
  subNodeRadius: 110, // 小球基础半径更大
  subNodeMinRadius: 100, // 小球最小半径
  subNodeMaxRadius: 160, // 小球最大半径
  subNodeDistance: 480, // 子节点距离主球更远
  mainFontSize: 76, // 主文字更大（原56）
  phoneticSize: 45, // 拼音更大（原28）
  subFontSize: 25, // 小球释义字号更大（原18）
  virtualWordColor: '#8C7853',
  realWordColor: '#B3423A',
  subNodeColor: '#E0D7C7',
  linkColor: '#A89987'
}

// 初始化画布
function initCanvas() {
  const wrapper = canvasWrapper.value
  if (!wrapper) return

  viewportWidth = wrapper.clientWidth
  viewportHeight = wrapper.clientHeight

  // 只初始化一次svg和mainGroup
  if (!svg) {
    svg = d3
      .select(svgContainer.value)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`)
      .style('cursor', 'grab')

    d3.select(svgContainer.value.querySelector('g')).attr(
      'transform',
      'translate(0,0) scale(1)'
    )

    // 配置缩放
    zoom = d3
      .zoom()
      .scaleExtent([0.2, 2])
      .on('zoom', (event) => {
        // 动态限制平移范围，保证内容始终在可视区内
        let { x, y, k } = event.transform
        // 只用缓存的 bbox
        const bbox = cachedBBox
        // 内容实际宽高（缩放后）
        const contentWidth = (bbox.maxX - bbox.minX) * k
        const contentHeight = (bbox.maxY - bbox.minY) * k
        // 允许的平移范围
        // 视口宽高
        const w = viewportWidth
        const h = viewportHeight
        // 最小/最大平移，使内容不会被拖出视口
        // 注意：D3 的 translate(x, y) 是内容左上角到视口左上角的偏移
        // 允许内容边缘正好贴到视口边缘，且和初始定位一致
        const minX = Math.min(0, w - contentWidth) - bbox.minX * k
        const maxX = 0 - bbox.minX * k
        const minY = Math.min(0, h - contentHeight - 130) - bbox.minY * k
        const maxY = 0 - bbox.minY * k
        // 调试：打印zoom事件的x/y和minX/minY
        // console.log('zoom event', { x, y, minX, maxX, minY, maxY })
        x = Math.max(minX, Math.min(maxX, x))
        y = Math.max(minY, Math.min(maxY, y))
        d3.select(svgContainer.value.querySelector('g')).attr(
          'transform',
          `translate(${x},${y}) scale(${k})`
        )
      })

    svg.call(zoom)

    // 初始定位：自适应缩放/平移，且和zoom边界一致，避免跳动和底部溢出
    cachedLayout = calculateAllWordsLayout(props.wordList || [])
    cachedBBox = getLayoutBoundingBox(cachedLayout)
    const bbox = cachedBBox
    // 缩放比例，宽度0.8，高度0.6，避免撑满底部
    const scaleX = (viewportWidth * 0.8) / (bbox.maxX - bbox.minX)
    const scaleY = (viewportHeight * 0.6) / (bbox.maxY - bbox.minY)
    // const initScale = 0.5
    // const minX = 100
    // const minY = 100
    const initScale = Math.min(scaleX, scaleY, 0.55)
    const contentWidth = (bbox.maxX - bbox.minX) * initScale
    const contentHeight = (bbox.maxY - bbox.minY) * initScale
    const w = viewportWidth
    const h = viewportHeight
    const minX = Math.min(0, w - contentWidth) - bbox.minX * initScale
    const minY = Math.min(0, h - contentHeight) - bbox.minY * initScale
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(minX, minY).scale(initScale)
    )

    // 添加SVG背景点击事件
    svg.on('click', (event) => {
      const target = event.target
      if (target.tagName === 'svg' || target === svgContainer.value) {
        closeDetail()
      }
    })
  } else {
    // 只更新viewBox
    svg.attr('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`)
  }
}

// 计算单个词的布局
function calculateWordLayout(word) {
  if (!word) return []

  const layout = []

  // 始终将单词放在中心位置
  const centerX = 0 // 使用0作为中心点X坐标
  const centerY = 0 // 使用0作为中心点Y坐标

  // 主节点位置
  const mainNode = {
    ...word,
    x: centerX,
    y: centerY,
    radius: calculateNodeRadius(word.meaningsPoemsList?.length || 0),
    type: 'main',
    isVirtual: word.meaningsPoemsList?.[0]?.type === '虚词'
  }
  layout.push(mainNode)

  // 子节点位置（围绕主节点均匀分布）
  if (word.meaningsPoemsList?.length) {
    word.meaningsPoemsList.forEach((meaning, mIndex) => {
      const angle = (2 * Math.PI * mIndex) / word.meaningsPoemsList.length
      const subX = centerX + Math.cos(angle) * LAYOUT_CONFIG.subNodeDistance
      const subY = centerY + Math.sin(angle) * LAYOUT_CONFIG.subNodeDistance

      layout.push({
        id: `${word.id}-${mIndex}`,
        parentId: word.id,
        x: subX,
        y: subY,
        meaning: meaning.meaning,
        radius: calculateSubNodeRadius(meaning.meaning), // 用自适应半径
        type: 'sub',
        fullData: meaning
      })
    })
  }

  // 单词整体平移到左上角为(0,0)
  let minX = Infinity
  let minY = Infinity
  layout.forEach((node) => {
    minX = Math.min(minX, node.x - node.radius)
    minY = Math.min(minY, node.y - node.radius)
  })
  layout.forEach((node) => {
    node.x = node.x - minX
    node.y = node.y - minY
  })
  return layout
}

// 计算所有词的布局（宽比例6:4，行数更少，初始展示中间）
function calculateAllWordsLayout(wordList) {
  if (!wordList || wordList.length === 0) return []
  if (wordList.length === 1) {
    // 只有一个词时，主节点居中
    const word = wordList[0]
    const layout = []
    const centerX = 0
    const centerY = 0
    // 主节点
    const mainNode = {
      ...word,
      id: word.id,
      x: centerX,
      y: centerY,
      radius: calculateNodeRadius(word.meaningsPoemsList?.length || 0),
      type: 'main',
      isVirtual: word.meaningsPoemsList?.[0]?.type === '虚词'
    }
    layout.push(mainNode)
    // 子节点
    if (word.meaningsPoemsList?.length) {
      const subCount = word.meaningsPoemsList.length
      const angleStep = (2 * Math.PI) / subCount
      word.meaningsPoemsList.forEach((meaning, mIndex) => {
        const angle = angleStep * mIndex
        const subX = centerX + Math.cos(angle) * LAYOUT_CONFIG.subNodeDistance
        const subY = centerY + Math.sin(angle) * LAYOUT_CONFIG.subNodeDistance
        layout.push({
          id: `${word.id}-${mIndex}`,
          parentId: word.id,
          x: subX,
          y: subY,
          meaning: meaning.meaning,
          radius: calculateSubNodeRadius(meaning.meaning), // 用自适应半径
          type: 'sub',
          fullData: meaning
        })
      })
    }
    // 单词整体平移到左上角为(0,0)
    let minX = Infinity
    let minY = Infinity
    layout.forEach((node) => {
      minX = Math.min(minX, node.x - node.radius)
      minY = Math.min(minY, node.y - node.radius)
    })
    layout.forEach((node) => {
      node.x = node.x - minX
      node.y = node.y - minY
    })
    return layout
  }

  const layout = []
  // 单元参数
  const padding = 40
  const mainR = LAYOUT_CONFIG.maxRadius
  const subDist = LAYOUT_CONFIG.subNodeDistance
  const subR = LAYOUT_CONFIG.subNodeRadius
  const nodeRadius = mainR + subDist + subR
  const cellW = nodeRadius * 2 + 10
  const cellH = nodeRadius * 2 + 10
  const xGap = 0
  const yGap = 0

  // 让排布比例为6:4（更宽更扁）
  const rowCount = 4 // 让行数约为4
  const colCount = Math.ceil(wordList.length / rowCount)

  wordList.forEach((word, idx) => {
    const row = Math.floor(idx / colCount)
    const col = idx % colCount
    // 横向交错排布：偶数行正常，奇数行整体x偏移半个单元
    const offsetX =
      padding + col * (cellW + xGap) + (row % 2 === 1 ? (cellW + xGap) / 2 : 0)
    const offsetY = padding + row * (cellH + yGap)

    // 主节点
    const mainNode = {
      ...word,
      id: word.id,
      x: offsetX + cellW / 2,
      y: offsetY + cellH / 2,
      radius: calculateNodeRadius(word.meaningsPoemsList?.length || 0),
      type: 'main',
      isVirtual: word.meaningsPoemsList?.[0]?.type === '虚词'
    }
    layout.push(mainNode)
    // 子节点
    if (word.meaningsPoemsList?.length) {
      const subCount = word.meaningsPoemsList.length
      const angleStep = (2 * Math.PI) / subCount
      word.meaningsPoemsList.forEach((meaning, mIndex) => {
        const angle = angleStep * mIndex
        const subX =
          mainNode.x + Math.cos(angle) * LAYOUT_CONFIG.subNodeDistance
        const subY =
          mainNode.y + Math.sin(angle) * LAYOUT_CONFIG.subNodeDistance
        layout.push({
          id: `${word.id}-${mIndex}`,
          parentId: word.id,
          x: subX,
          y: subY,
          meaning: meaning.meaning,
          radius: calculateSubNodeRadius(meaning.meaning), // 用自适应半径
          type: 'sub',
          fullData: meaning
        })
      })
    }
  })
  // === 新增整体平移，使内容左上角为(0,0) ===
  let minX = Infinity
  let minY = Infinity
  layout.forEach((node) => {
    minX = Math.min(minX, node.x - node.radius)
    minY = Math.min(minY, node.y - node.radius)
  })
  layout.forEach((node) => {
    node.x = node.x - minX
    node.y = node.y - minY
  })
  return layout
}

// 计算布局包围盒
function getLayoutBoundingBox(layout) {
  if (!layout.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity
  layout.forEach((node) => {
    minX = Math.min(minX, node.x - node.radius)
    maxX = Math.max(maxX, node.x + node.radius)
    minY = Math.min(minY, node.y - node.radius)
    maxY = Math.max(maxY, node.y + node.radius)
  })
  return { minX, maxX, minY, maxY }
}

// 更新可视化
function updateVisualization() {
  const data = props.wordList || []
  const layout = calculateAllWordsLayout(data)
  // 遍历 data，生成所有节点和连线

  // 每次都重新获取 mainGroup
  const mainGroup = d3.select(svgContainer.value.querySelector('g'))
  if (!mainGroup || !layout || layout.length === 0) return

  mainGroup.selectAll('*').remove()

  const links = generateLinks(layout)

  // 绘制连线
  mainGroup
    .selectAll('.link')
    .data(links)
    .join('path')
    .attr('class', 'link')
    .attr('stroke', LAYOUT_CONFIG.linkColor)
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr(
      'd',
      (d) => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
    )

  // 绘制节点
  const nodes = mainGroup
    .selectAll('.node')
    .data(layout)
    .join('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  // 绘制圆形
  nodes
    .append('circle')
    .attr('r', (d) => d.radius)
    .attr('fill', (d) =>
      d.type === 'sub'
        ? LAYOUT_CONFIG.subNodeColor
        : d.isVirtual
          ? LAYOUT_CONFIG.virtualWordColor
          : LAYOUT_CONFIG.realWordColor
    )
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  // 添加文本
  const texts = nodes
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', (d) => (d.type === 'main' ? '-0.2em' : '0.3em'))
    .style('font-family', '华文楷体, SimKai')
    .style('fill', (d) => (d.type === 'main' ? '#fff' : '#666'))
    .style('pointer-events', 'none')

  // 主节点文本
  texts
    .filter((d) => d.type === 'main')
    .selectAll('tspan')
    .data((d) => [
      { text: d.word, size: LAYOUT_CONFIG.mainFontSize },
      { text: d.phoneticize, size: LAYOUT_CONFIG.phoneticSize },
      {
        text: d.priority != null ? `${d.priority}` : '',
        size: LAYOUT_CONFIG.phoneticSize - 15
      } // 新增
    ])
    .join('tspan')
    .attr('x', 0)
    .attr('dy', (_, i) => (i === 0 ? 0 : '1.4em'))
    .style('font-size', (d) => `${d.size}px`)
    .text((d) => d.text)

  // 子节点文本
  texts
    .filter((d) => d.type === 'sub')
    .style('font-size', `${LAYOUT_CONFIG.subFontSize}px`)
    .attr('dominant-baseline', 'middle') // 垂直居中
    .each(function (d) {
      d3.select(this).text(null)
      // 自动分行：每行最多10字
      const words = d.meaning.match(/.{1,10}/g) || ['']
      const totalLines = words.length
      words.forEach((line, i) => {
        d3.select(this)
          .append('tspan')
          .attr('x', 0)
          // 使多行整体垂直居中
          .attr('dy', i === 0 ? `${-((totalLines - 1) / 2) * 1.2}em` : '1.2em')
          .text(line)
      })
    })

  // 修改点击事件处理
  nodes.on('click', function (event, d) {
    event.stopPropagation()
    if (d.type === 'sub') {
      selectedMeaning.value = d.fullData
      const parentNode = layout.find((n) => n.id === d.parentId)
      selectedNode.value = parentNode
    } else if (d.type === 'main') {
      selectedNode.value = d
      selectedMeaning.value = null
    }
  })
}

// 生成连接
function generateLinks(layout) {
  const links = []
  layout.forEach((node) => {
    if (node.type === 'sub') {
      const parent = layout.find((n) => n.id === node.parentId)
      if (parent) {
        links.push({
          source: parent,
          target: node
        })
      }
    }
  })
  return links
}

function calculateNodeRadius(meaningCount) {
  return Math.min(
    LAYOUT_CONFIG.baseRadius + LAYOUT_CONFIG.radiusPerMeaning * meaningCount,
    LAYOUT_CONFIG.maxRadius
  )
}

// ====== 新增：小球半径自适应算法 ======
function calculateSubNodeRadius(meaning) {
  if (!meaning) return LAYOUT_CONFIG.subNodeMinRadius
  // 以字符数为基准，中文字符宽度大致为字号的0.6-0.7倍
  const text = typeof meaning === 'string' ? meaning : meaning.meaning || ''
  const len = text.length
  // 经验公式：基础半径 + 每10字增加10px，平滑递增
  let r = LAYOUT_CONFIG.subNodeMinRadius + Math.ceil(len / 10) * 16
  // 限定最大/最小
  r = Math.max(
    LAYOUT_CONFIG.subNodeMinRadius,
    Math.min(r, LAYOUT_CONFIG.subNodeMaxRadius)
  )
  return r
}

// 监听窗口大小变化
function handleResize() {
  if (!canvasWrapper.value || !svg) return

  try {
    viewportWidth = canvasWrapper.value.clientWidth || 800
    viewportHeight = canvasWrapper.value.clientHeight || 600

    svg.attr('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`)

    // 保持当前的缩放状态
    // 不要重置zoom transform
    if (props.wordData) {
      const layout = calculateWordLayout(props.wordData)
      updateVisualization(layout)
    }
  } catch (error) {
    console.error('Error handling resize:', error)
  }
}

// 修改监听器
watch(
  () => props.wordData,
  (newWordData) => {
    if (!svg) {
      initCanvas()
    }

    if (newWordData) {
      const layout = calculateWordLayout(newWordData)
      if (layout.length > 0) {
        selectedNode.value = layout[0]
        selectedMeaning.value = null
        nextTick(() => {
          updateVisualization(layout)
        })
      }
    }
  },
  { immediate: true }
)

// 监听 wordList
watch(
  () => props.wordList,
  () => {
    nextTick(() => {
      cachedLayout = calculateAllWordsLayout(props.wordList || [])
      cachedBBox = getLayoutBoundingBox(cachedLayout)
      updateVisualization()
      // 强制重置 D3 视角为固定初始值
      if (svg && zoom) {
        const initScale = 0.5
        const minX = 100
        const minY = 100
        svg.call(
          zoom.transform,
          d3.zoomIdentity.translate(minX, minY).scale(initScale)
        )
      }
    })
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  nextTick(() => {
    initCanvas()
    if (props.wordData) {
      const layout = calculateWordLayout(props.wordData)
      updateVisualization(layout)
    }
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (svg) {
    svg.selectAll('*').remove()
    svg = null
  }
  zoom = null
})

function copyDetail() {
  // 复制详情面板所有文字
  let text = ''
  if (selectedNode.value) {
    text += `【${selectedNode.value.word || ''}】${selectedNode.value.phoneticize || ''}\n`
  }
  if (selectedMeaning.value) {
    text += `${selectedMeaning.value.type || '释义'}\n`
    text += `${selectedMeaning.value.meaning || ''}\n`
    if (selectedMeaning.value.examplesPoemsList?.length) {
      text += '例句：\n'
      selectedMeaning.value.examplesPoemsList.forEach((ex) => {
        text += `▶ ${ex.example}\n—— ${ex.source}${ex.grade != null && ex.grade !== '' ? ' ' + ex.grade : ''}\n`
      })
    }
  }
  // 兼容性复制
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage.success({ message: '复制成功', duration: 1000 })
      })
      .catch(() => {
        fallbackCopyText(text)
      })
  } else {
    fallbackCopyText(text)
  }
}

function fallbackCopyText(text) {
  // 创建临时textarea
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      ElMessage.success({ message: '复制成功', duration: 1000 })
    } else {
      ElMessage.error({ message: '复制失败，请手动复制', duration: 2000 })
    }
  } catch (err) {
    ElMessage.error({ message: '复制失败，请手动复制', duration: 2000 })
  }
  document.body.removeChild(textarea)
}
</script>

<style scoped>
.word-graph-container {
  width: 100%;
  height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.detail-panel {
  position: fixed;
  right: 20px;
  top: 20px;
  width: 300px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
  max-height: calc(100% - 40px);
  overflow-y: auto;
  z-index: 101;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
  font-family: '华文楷体', SimKai;
  color: #8c7853;
  line-height: 1.2;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0 4px;
  margin: -4px -4px 0 0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #666;
}

.meaning-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.meaning-type {
  padding: 4px 8px;
  background: #e0d7c7;
  border-radius: 4px;
  font-size: 14px;
  color: #8c7853;
}

.meaning-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.examples h4 {
  color: #8c7853;
  margin: 16px 0 8px;
  font-size: 16px;
}

.example-item {
  margin: 12px 0;
  padding-left: 20px;
}

.example-item p {
  margin: 4px 0;
  color: #333;
}

.example-item small {
  color: #999;
  font-style: italic;
}

:deep(.link) {
  pointer-events: none;
}

:deep(.node) {
  cursor: pointer;
}

.copy-btn {
  background: #f0f0f0;
  border: none;
  font-size: 15px; /* 原18px，缩小 */
  color: #888;
  cursor: pointer;
  padding: 0 7px; /* 原10px，缩小 */
  margin: -4px 0 0 0;
  border-radius: 4px;
  height: 26px; /* 原32px，缩小 */
  transition:
    background 0.2s,
    color 0.2s;
}

.copy-btn:hover {
  background: #e0e0e0;
  color: #555;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.d3-empty {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 2;
}
</style>
