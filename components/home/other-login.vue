<!--
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2020-04-05 22:11:28
 * @LastEditTime: 2020-04-05 22:17:26
 * @Description: other-login
 -->
<template>
	<view class="other-login u-f-ac">
		<!-- #ifdef APP-PLUS -->
		<block v-for="(item,index) in providerList" :key="index">
			<view class="u-f-ajc u-f1" @tap="tologin(item)">
				<view class="icon iconfont u-f-ajc" 
				      :class="['icon-' + item.icon]">
        </view>
			</view>
		</block>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">微信登录</button>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
  props: {
    noback: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      providerList: []
    }
  },
  onReady() {
    // #ifdef APP-PLUS
    this.getLoginAuth()
    // #endif
  },
  methods: {
    // #ifdef MP-WEIXIN
    mpGetUserInfo(result) {
      uni.showLoading({
        title: '登录中...',
        mask: true
      })
      // 获取失败
      if (result.detail.errMsg !== 'getUserInfo:ok') {
        uni.hideLoading()
        uni.showModal({
          title: '获取用户信息失败',
          content: '错误原因' + result.detail.errMsg,
          showCancel: false
        })
        return
      }
      let userinfo = result.detail.userInfo
      uni.login({
        provider: 'weixin',
        success: (res) => {
          this.$http.post('/wxlogin', {
            code: res.code,
            nickName: userinfo.nickName,
            avatarUrl: userinfo.avatarUrl
          }).then(data => {
            let [err2, res2] = data
            // 登录失败
            if (!this.$http.errorCheck(err2, res2)) {
              return false
            }
            // 登录成功 保存状态
            this.User.token = res2.data.data.token
            this.User.userinfo = this.User.__formatUserinfo(res2.data.data)
            // 本地存储
            uni.setStorageSync('userinfo', this.User.userinfo)
            uni.setStorageSync('token', this.User.token)
            // 获取用户相关统计
            this.User.getCounts()
            // 连接socket
            if (this.User.userinfo.id) {
              this.$chat.Open()
            }
            // 成功提示
            uni.showToast({ title: '登录成功' })
            // 登录成功，重新加载数据
            this.$emit('logining')
          })
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },
    // #endif
    // 获取当前登录渠道
    getLoginAuth() {
      uni.getProvider({
        service: 'oauth',
        success: (result) => {
          this.providerList = result.provider.map((value) => {
            let providerName = ''
            let icon = ''
            switch (value) {
              case 'weixin':
                providerName = '微信登录'
                icon = 'weixin'
                break
              case 'qq':
                providerName = 'QQ登录'
                icon = 'QQ'
                break
              case 'sinaweibo':
                providerName = '新浪微博登录'
                icon ='xinlangweibo'
                break
              case 'alipay':
                providerName = '支付宝登录'
                icon =''
                break
            }
            return {
              name: providerName,
              icon: icon,
              id: value
            }
          })
        },
        fail: (error) => {
          console.log('获取登录通道失败', error)
        }
      })
    },
    // 登录
    tologin(provider) {
      uni.login({
        provider: provider.id,
        success: (res) => {
          uni.getUserInfo({
            provider: provider.id,
            success: (infoRes) => {
              let data = this.User.__formatOtherLogin(provider.id, Object.assign(infoRes, res))
              this.loginEvent(data)
            }
          })
          // 更新保存在 store 中的登录状态
          console.log('登录成功，保存到本地存储，修改当前用户登录状态')
        },
        fail: (err) => {
          console.log('login fail:', err)
        }
      })
    },
    async loginEvent(data) {
      let res = await this.User.login({
        url: '/user/otherlogin',
        data: data,
        Noback: this.noback
      })
      if (res) {
        // 登录成功，重新加载数据
        this.$emit('logining')
      }
    }
  }
}
</script>

<style>
.other-login{
	padding: 20upx 80upx;
}
.other-login>view>view{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	font-size: 55upx;
	color: #FFFFFF;
}
.other-login .icon-QQ{
	background: #2CAEFC;
}
.other-login .icon-weixin{
	background: #2BD19B;
}
.other-login .icon-xinlangweibo{
	background: #FC7729;
}
</style>
