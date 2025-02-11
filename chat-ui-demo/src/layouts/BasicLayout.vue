<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';


</script>

<template>

  <div id="basicLayout">

    <!-- 页面布局 -->
    <a-layout>
      <!-- 顶部 -->
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <!-- 内容 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <!-- 底部 -->
      <a-layout-footer class="footer">
        <a href="https://www.bilibili.com">
          B站链接
        </a>
      </a-layout-footer>
    </a-layout>
  </div>



</template>

<style scoped>
#basicLayout .footer {
  background-color: #efefef;
  text-align: center;

}

#basicLayout .content {
  padding: 20px;
  /* 这里给底部内容腾出空间，防止遮挡 */
  margin-bottom: 20px;

  background: linear-gradient(to right, wheat, #fff);
}

#basicLayout .header {
  background-color: white;
  margin-bottom: 16px;
  color: unset;
  padding-inline: 20px;
}
</style>
