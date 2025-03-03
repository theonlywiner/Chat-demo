<script setup>
import { onMounted, useSlots, ref } from 'vue'
import ai_index from './ai_index.vue'

onMounted(() => {
	foldingMethod()
})

//折叠状态
const foldedState = ref(true)
//折叠方法
const foldingMethod = () => {
	const resize = document.querySelector('.centerBox .arrowBox')
	const left = document.querySelector('.leftBox')

	// 鼠标按下事件
	resize.onmousedown = function (MouseEvent) {
		if (left.style.width === '0px') {
			left.style.width = '350px'
		} else {
			left.style.width = '0px'
		}
		//取反，用于显示侧边栏和折叠icon
		foldedState.value = !foldedState.value
	}
}
</script>
<template>
	<div class="bigBox">
		<div class="leftBox" v-if="foldedState">侧边栏,用于展示历史记录</div>
		<!--折叠-->

		<div class="rightBox">
			<!-- 按钮栏 -->
			<div class="centerBox">
				<div class="arrowBox">
					<el-icon class="folding" size="15" color="#fff">
						<!-- 根据折叠状态显示icon -->
						<ArrowRightBold v-if="!foldedState" />
						<ArrowLeftBold v-if="foldedState" />
					</el-icon>
				</div>
			</div>
			<!-- 内容栏 -->
			<div class="content">
				<ai_index/>
			</div>
		</div>
	</div>
</template>
<style scoped>

.rightBox {
	display: flex;
}

.content {
	width: 100%;
	
	margin-right: 20px;
}

.bigBox {
	height: 100%;
	width: 100%;
	display: flex;
}

.bigBox .leftBox {
	height: 100%;
	width: 350px;
	border: 1px solid red;
}

.bigBox .centerBox {
	width: 20px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
}

.bigBox .centerBox .arrowBox {
	width: 15px;
	height: 35px;
	margin-top: -10px;
	color: #fff;
	text-align: center;
	background: #79cdfb;
	border-radius: 6px;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.bigBox .centerBox .arrowBox .folding {
	z-index: 99;
}

.bigBox .rightBox {
	height: 100%;
	flex: 1;
	border: 1px solid red;
}
</style>
