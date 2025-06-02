<!-- 常用词详情页 -->
<template>
  <el-dialog v-model="show" width="420px" :show-close="true" append-to-body>
    <template #header>
      <div style="font-weight: bold; font-size: 20px">词条详情</div>
    </template>
    <div>
      <div
        class="panel-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        "
      >
        <h2
          style="
            margin: 0;
            font-family: '华文楷体', SimKai;
            color: #8c7853;
            line-height: 1.2;
            flex: 1;
          "
        >
          【{{ node?.word || '' }}】{{ node?.phoneticize || '' }}
        </h2>
        <button class="copy-btn" @click="copyDetail" style="margin-left: 8px">
          复制
        </button>
      </div>
      <div
        class="meaning-header"
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        "
      >
        <span
          class="meaning-type"
          style="
            padding: 4px 8px;
            background: #e0d7c7;
            border-radius: 4px;
            font-size: 14px;
            color: #8c7853;
          "
        >
          {{ meaning?.type || '释义' }}
        </span>
      </div>
      <div
        class="meaning-content"
        style="font-size: 14px; color: #666; line-height: 1.6"
      >
        <p>{{ meaning?.meaning }}</p>
        <div
          v-if="meaning?.examplesPoemsList && meaning.examplesPoemsList.length"
          class="examples"
        >
          <h4 style="color: #8c7853; margin: 16px 0 8px; font-size: 16px">
            例句：
          </h4>
          <div
            v-for="ex in meaning.examplesPoemsList"
            :key="ex.id"
            class="example-item"
            style="margin: 12px 0; padding-left: 20px"
          >
            <p style="margin: 4px 0; color: #333">▶ {{ ex.example }}</p>
            <small style="color: #999; font-style: italic">
              —— {{ ex.source
              }}<template v-if="ex.grade != null && ex.grade !== ''">
                {{ ex.grade }}</template
              >
            </small>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch, defineProps, defineEmits } from 'vue'
const props = defineProps({
  show: Boolean,
  node: Object,
  meaning: Object
})
const emit = defineEmits(['update:show'])
const show = ref(props.show)
watch(
  () => props.show,
  (v) => (show.value = v)
)
watch(show, (v) => emit('update:show', v))

function copyDetail() {
  let text = ''
  if (props.node) {
    text += `【${props.node.word || ''}】${props.node.phoneticize || ''}\n`
  }
  if (props.meaning) {
    text += `${props.meaning.type || '释义'}\n`
    text += `${props.meaning.meaning || ''}\n`
    if (props.meaning.examplesPoemsList?.length) {
      text += '例句：\n'
      props.meaning.examplesPoemsList.forEach((ex) => {
        text += `▶ ${ex.example}\n—— ${ex.source}${ex.grade != null && ex.grade !== '' ? ' ' + ex.grade : ''}\n`
      })
    }
  }
  navigator.clipboard.writeText(text)
  ElMessage.success({
    message: '复制成功',
    duration: 1000
  })
}
</script>

<style scoped>
.copy-btn {
  background: #f0f0f0;
  border: none;
  font-size: 15px;
  color: #888;
  cursor: pointer;
  padding: 0 7px;
  margin: -4px 0 0 0;
  border-radius: 4px;
  height: 26px;
  transition:
    background 0.2s,
    color 0.2s;
}
.copy-btn:hover {
  background: #e0e0e0;
  color: #555;
}
</style>
