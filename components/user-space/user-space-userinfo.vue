<!--
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2020-04-05 23:52:25
 * @LastEditTime: 2020-04-05 23:53:17
 * @Description: user-space-userinfo
 -->
<template>
	<view class="user-space-userinfo">
		<view class="user-space-userinfo-item">
			<view>账号信息</view>
			<view>糗龄：{{getRegAge}}</view>
			<view>糗百ID：{{userinfo.id}}</view>
		</view>
		<view class="user-space-userinfo-item">
			<view>个人信息</view>
			<view>星座：{{getXingZuo}}</view>
			<view>职业：{{userinfo.job}}</view>
			<view>故乡：{{userinfo.path}}</view>
			<view>情感：{{userinfo.qg}}</view>
		</view>
	</view>
</template>

<script>
import t from "../../common/time.js"

export default {
  props: {
    userinfo: Object
  },
  computed: {
    getRegAge() {
      if (!this.userinfo.regtime) {
        return '未知'
      }
      return t.gettime.sumAge(this.userinfo.regtime)
    },
    getXingZuo() {
      if (!this.userinfo.birthday || this.userinfo.birthday == '未知' || this.userinfo.birthday === '') {
        return '未知'
      }
      return t.gettime.getHoroscope(this.userinfo.birthday)
    }
  }
}
</script>

<style scoped>
.user-space-userinfo{
	padding: 0 30upx;
}
.user-space-userinfo-item{
	padding: 20upx 0;
	border-bottom: 1upx solid #EEEEEE;
}
.user-space-userinfo-item>view{
	color: #AAAAAA;
}
.user-space-userinfo-item>view:first-child{
	color: #333333;
	font-size: 35upx;
	padding: 15upx 0;
}
</style>
