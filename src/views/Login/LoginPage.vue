<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
//模拟接口应用
import { userLoginService, userRegisterService } from '@/api/user.js'
import { useRouter } from 'vue-router'

const router = useRouter()

//判断是登录还是注册
const isRegister = ref(false)

//获取表单
const form = ref(null)

//整个用于提交的数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

//登录注册密码检验规则
const rules = {
  username: [
    //必须有  blur 失去焦点的时候校验   change 实时校验
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15 位 非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15 位 非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        //判断两次密码是否一致  错误与否都需要callback
        if (value === formModel.value.password) {
          callback()
        } else {
          callback(new Error('两次密码不一致'))
        }
      },
      trigger: 'blur'
    }
  ]
}

//切换的时候  需要重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

//注册
const register = async () => {
  //表单初始校验
  await form.value.validate()
  //模拟接口检验
  if (userRegisterService(formModel.value)) {
    ElMessage.success('注册成功')
    //注册成功
    isRegister.value = false
  } else {
    ElMessage.error('注册失败')
  }
}

//登录
const login = async () => {
  //表单初始校验
  await form.value.validate()
  //模拟接口检验
  if (userLoginService(formModel.value)) {
    ElMessage.success('登录成功')
    router.push('/')
  } else {
    ElMessage.error('登录失败')
    //点击之后清空数据
    formModel.value = {
      username: formModel.value.username,
      password: ''
    }
  }
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>浙外古诗文问答</h1>
        </el-form-item>
        <el-form-item>
          <h3>注册</h3>
        </el-form-item>
        <!-- 生效规则 -->
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register()"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>浙外古诗文问答</h1>
        </el-form-item>
        <el-form-item>
          <h3>登录</h3>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login()"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('/src/assets/bg.jpeg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
