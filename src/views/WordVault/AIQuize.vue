<template>
  <div class="quiz-page">
    <el-button class="back-btn" type="text" @click="handleBack">
      <el-icon><ArrowLeft /></el-icon> 返回
    </el-button>
    <div class="quiz-title">
      AI智能出题 - 词语：<span class="quiz-word">{{ quizData.word }}</span>
    </div>
    <div
      v-if="quizData.choiceQuestionsList && quizData.choiceQuestionsList.length"
      class="quiz-section"
    >
      <div class="section-title">选择题</div>
      <div
        v-for="(q, idx) in quizData.choiceQuestionsList"
        :key="q.id"
        class="quiz-question"
      >
        <div class="question-content">{{ idx + 1 }}. {{ q.content }}</div>
        <el-radio-group v-model="userChoice[q.id]">
          <el-radio
            v-for="(opt, optIdx) in q.options"
            :key="optIdx"
            :label="optIdx + 1"
            class="quiz-option"
          >
            {{ String.fromCharCode(65 + optIdx) }}. {{ opt }}
          </el-radio>
        </el-radio-group>
        <div v-if="userChoice[q.id] !== undefined" class="answer-block">
          <span :class="userChoice[q.id] == q.answer + 1 ? 'correct' : 'wrong'">
            {{ userChoice[q.id] == q.answer + 1 ? '✔ 答对了' : '✘ 答错了' }}
          </span>
          <span class="answer-detail">
            正确答案：{{ String.fromCharCode(65 + q.answer) }}
          </span>
          <span class="analysis">解析：{{ q.analysis }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="quizData.blankQuestionsList && quizData.blankQuestionsList.length"
      class="quiz-section"
    >
      <div class="section-title">填空题</div>
      <div
        v-for="(q, idx) in quizData.blankQuestionsList"
        :key="q.id"
        class="quiz-question"
      >
        <div class="question-content">
          {{ idx + 1 + (quizData.choiceQuestionsList?.length || 0) }}.
          {{ q.content }}
        </div>
        <el-input
          v-model="userBlank[q.id]"
          placeholder="请输入答案"
          class="blank-input"
        />
        <div v-if="userBlank[q.id]" class="answer-block">
          <span
            :class="userBlank[q.id].trim() === q.answer ? 'correct' : 'wrong'"
          >
            {{ userBlank[q.id].trim() === q.answer ? '✔ 正确' : '✘ 错误' }}
          </span>
          <span class="answer-detail">正确答案：{{ q.answer }}</span>
          <span class="analysis">解析：{{ q.analysis }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getQuestionsBySessionId } from '@/api/aiGenerate'

const route = useRoute()
const router = useRouter()

// 模拟后端数据，实际应通过接口获取
const quizData = ref({
  id: null,
  word: '',
  choiceQuestionsList: [],
  blankQuestionsList: []
})

const userChoice = reactive({})
const userBlank = reactive({})

function handleBack() {
  router.back()
}

onMounted(async () => {
  // 优先通过 sessionId 查询题目
  if (route.query.sessionId) {
    try {
      const data = await getQuestionsBySessionId(route.query.sessionId)
      quizData.value = data || {}
    } catch {
      quizData.value = {}
    }
  } else {
    quizData.value = {
      id: route.query.id,
      word: route.query.word || '',
      choiceQuestionsList: [],
      blankQuestionsList: []
    }
  }
})
</script>

<style scoped>
.quiz-page {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 28px 40px 28px;
  min-height: 80vh;
  position: relative;
}
.back-btn {
  position: absolute;
  left: 24px;
  top: 24px;
  font-size: 16px;
  color: #409eff;
}
.quiz-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 32px;
}
.quiz-word {
  color: #1e90ff;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 24px 0 12px 0;
  color: #333;
}
.quiz-question {
  margin-bottom: 28px;
  padding: 18px 20px 12px 20px;
  background: #f8faff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(30, 144, 255, 0.04);
  word-break: break-all;
}
.question-content {
  margin-bottom: 14px; /* 新增：题干和输入框之间留距离 */
  font-size: 16px;
  color: #222;
  word-break: break-all;
  white-space: pre-line;
}
.el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 让所有选项左对齐 */
  gap: 12px;
  margin-bottom: 8px;
}
.quiz-option {
  display: block;
  text-align: left; /* 选项内容左对齐 */
  word-break: break-all;
  white-space: pre-line;
  font-size: 15px;
  padding: 8px 10px;
  background: #f4f8ff;
  border-radius: 5px;
  max-width: 100%;
  margin-left: 0; /* 不缩进 */
}
.blank-input {
  width: 60%;
  margin-bottom: 8px;
}
.answer-block {
  margin-top: 8px;
  font-size: 15px;
}
.correct {
  color: #67c23a;
  font-weight: bold;
  margin-right: 12px;
}
.wrong {
  color: #f56c6c;
  font-weight: bold;
  margin-right: 12px;
}
.answer-detail {
  color: #888;
  margin-right: 12px;
}
.analysis {
  color: #409eff;
}
</style>
