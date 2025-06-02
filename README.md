这是一个修改测试（原来的内容注释掉了）

## 2025.6.2 

### @Aka branch: DailyPoem-and-Dashboard

相较于 `DailyPoem-and-Dashboard` branch 新增

- Login 界面表单左上角新增跳转 `'\danshboard'` 的 logo
- 删除 `'\dashboard'` 页面的用户登录边栏内容, 改为古诗背景, 并新增"了解更多"按钮
- `'\dashboard'` 上方的搜索栏已实现输入内容之后跳转自动搜索功能
- 给每日一诗新增Cache, 增加获取速度, 并在左下角增添刷新每日一诗按钮, 获取最新消息
- 对每日一诗api调用后的数据新增 `background` 字段, 方便之后的背景内容调用
 

仍存在问题:

- 在搜索阿拉伯数字的时候会有结果, 即部分古诗文的内容里有阿拉伯数字的存在.
- 每日一诗"了解更多"按钮跳转后可能会遇到同题目不同作者的多首古诗, 我们需要更精确的搜索

## 2025.2.12
修复了页面宽度以及导航栏随着窗口缩放异常的问题

新增了一个半成品的ai问答页面（老的还在）

## 2025.2.13
改用老的ai问答页面，调整了一些样式

给ai页面加了一个折叠侧边栏用于显示历史记录，同时引入了Element Plus的图标
<!-- # ChatChat

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
``` -->
