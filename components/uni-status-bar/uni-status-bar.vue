<!--
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2020-04-05 23:41:35
 * @LastEditTime: 2020-04-05 23:42:16
 * @Description: uni-status-bar
 -->
<template>
	<view class="uni-status-bar" :style="{ height: statusBarHeight, background: bgcolor}">
		<slot></slot>
	</view>
</template>

<script>
var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'

export default {
  name: 'uni-status-bar',
  props: {
    bgcolor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusBarHeight: statusBarHeight
    }
  }
}
</script>

<style>
.uni-status-bar {
  display: block;
  width: 100%;
  height: 20px;
  height: var(--status-bar-height);
}
</style>
