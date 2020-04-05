<!--
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2020-04-05 21:37:23
 * @LastEditTime: 2020-04-05 21:37:44
 * @Description: load-more
 -->
<template>
	<view class="load-more">{{loadtext}}</view>
</template>

<script>
export default {
  props: {
    loadtext: String
  }
}
</script>

<style scoped>
.load-more{
	text-align: center;
	color: #AAAAAA;
	padding: 15upx;
}
</style>
