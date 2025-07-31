<template>
  <div class="common-filter-bar">
    <div class="type-tags">
      <span class="filter-label">类型：</span>
      <el-tag
        v-for="type in typeOptions"
        :key="type.value"
        :type="modelValue.type === type.value ? 'success' : 'info'"
        :effect="modelValue.type === type.value ? 'dark' : 'plain'"
        @click="$emit('update:modelValue', { ...modelValue, type: type.value })"
        class="filter-tag large-tag"
        :closable="false"
        :size="'large'"
      >
        {{ type.label }}
      </el-tag>
    </div>
    <div class="dynasty-tags">
      <span class="filter-label">朝代：</span>
      <el-tag
        v-for="dynasty in dynastyOptions"
        :key="dynasty.value"
        :type="modelValue.dynasty === dynasty.value ? 'success' : 'info'"
        :effect="modelValue.dynasty === dynasty.value ? 'dark' : 'plain'"
        @click="$emit('update:modelValue', { ...modelValue, dynasty: dynasty.value })"
        class="filter-tag large-tag"
        :closable="false"
        :size="'large'"
      >
        {{ dynasty.label }}
      </el-tag>
    </div>
    <!-- 预留：后续可插入更多筛选项 -->
    <slot />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
  typeOptions: { type: Array, required: true },
  dynastyOptions: { type: Array, required: true },
  modelValue: { type: Object, required: true }
})
defineEmits(['update:modelValue'])
</script>

<style lang="less" scoped>
.common-filter-bar {
  margin-bottom: 20px;
  .type-tags, .dynasty-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 8px;
    .filter-label {
      margin-right: 8px;
      font-weight: bold;
      color: #333;
    }
    .filter-tag.large-tag {
      margin-right: 8px;
      margin-bottom: 4px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
      height: 40px;
      line-height: 38px;
      font-size: 16px;
      padding: 0 20px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
  }
}
</style> 