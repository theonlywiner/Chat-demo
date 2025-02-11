<template>
  <div class="login-container">
    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="Username" name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">忘记密码</a>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          登录
        </a-button>
        或
        <a href="/user/register">注册账号</a>
      </a-form-item>
    </a-form>
  </div>

</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>
<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 100px;
}

#components-form-demo-normal-login .login-form-forgot {
  float: right;
}

#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.login-container {
  display: flex;
  /* 使用 Flexbox 来居中表单 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 使容器高度占满视口高度 */
  margin: 0;
  /* 移除默认外边距 */

}

.login-form {
  width: 300px;
  /* 设置表单宽度，根据需要调整 */
  padding: 20px;
  /* 为表单添加内边距 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 可选：为表单添加阴影效果 */
  border-radius: 4px;
  /* 可选：为表单添加圆角边框 */
}

.login-form-forgot {
  float: right;
  /* 保持忘记密码链接在右侧 */
}

.login-form-button {
  width: 100%;
  /* 确保按钮宽度充满表单 */
}
</style>
