<!--
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2020-04-05 21:38:25
 * @LastEditTime: 2020-04-05 21:47:49
 * @Description: more-share
 -->
<template>
	<view class="animated fadeIn faster" v-if="show">
		<view class="more-share-model" @tap="togle"></view>
		<view class="more-share">
			<view class="more-share-title u-f-ajc">分享到</view>
			<scroll-view scroll-x class="more-share-body">
				<block v-for="(val, index) in providerList" :key="index">
					<view class="more-share-item" 
					      hover-class="more-share-hover"
					      @tap="share(val)">
						<view class="icon iconfont u-f-ajc"
						      :class="['icon-' + val.zicon, 'more-share-' + val.zclass]">
            </view>
						<view>{{val.name}}</view>
					</view>
				</block>
			</scroll-view>
			<view class="more-share-bottom u-f-ajc"
            hover-class="more-share-hover"
            @tap="togle">取消
      </view>
		</view>
		
	</view>
</template>

<script>
export default {
  props: {
    show: Boolean,
    sharedata: Object
  },
  data() {
    return {
      title: '',
      shareText: '',
      href: '',
      image: '',
      // 1文字 2图片 0图文 5小程序
      shareType: 1,
      providerList: []
    }
  },
  watch: {
    sharedata (newValue, oldValue) {
      this.title = newValue.title
      this.shareText = newValue.content
      this.href = newValue.url
      this.image = newValue.titlepic
      this.shareType = newValue.shareType
    }
  },
  onReady() {
    this.getProvider()
  },
  methods: {
    getProvider() {
      uni.getProvider({
        service: 'share',
        success: (e) => {
          let data = []
          for (let i = 0; i < e.provider.length; i++) {
            switch (e.provider[i]) {
              case 'weixin':
                data.push({
                  name: '微信好友',
                  id: 'weixin',
                  zicon: 'weixin',
                  zclass: 'wx',
                  sort: 0
                })
                data.push({
                  name: '朋友圈',
                  id: 'weixin',
                  type: 'WXSenceTimeline',
                  zicon: 'weixin',
                  zclass: 'pyq',
                  sort: 1
                })
                break
              case 'sinaweibo':
                data.push({
                  name: '新浪微博',
                  id: 'sinaweibo',
                  zicon: 'xinlangweibo',
                  zclass: 'wb',
                  sort: 2
                })
                break
              case 'qq':
                data.push({
                  name: 'QQ好友',
                  id: 'qq',
                  zicon: 'QQ',
                  zclass: 'qq',
                  sort: 3
                })
                break
              default:
                break
            }
          }
          this.providerList = data.sort((x, y) => {
            return x.sort - y.sort
          })
        },
        fail: (e) => {
          uni.showModal({
            content: '获取分享通道失败',
            showCancel: false
          })
        }
      })
    },
    togle(){
      this.$emit('togle')
    },
    async share(e) {
      if (!this.shareText && (this.shareType === 1 || this.shareType === 0)) {
        uni.showModal({
          content: '分享内容不能为空',
          showCancel: false
        })
        return
      }
      
      if (!this.image && (this.shareType === 2 || this.shareType === 0)) {
        uni.showModal({
          content: '分享图片不能为空',
          showCancel: false
        })
        return
      }
      
      let shareOPtions = {
        provider: e.id,
        // “WXSceneSession”分享到聊天界面， “WXSenceTimeline”分享到朋友圈， “WXSceneFavorite”分享到微信收藏
        scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession',  
        type: this.shareType,
        success: (e) => {
          uni.showModal({
            content: '分享成功',
            showCancel: false
          })
        },
        fail: (e) => {
          uni.showModal({
            content: e.errMsg,
            showCancel: false
          })
        },
        complete: () => {}
      }
      
      switch (this.shareType){
        case 0:
          shareOPtions.summary = this.shareText
          shareOPtions.imageUrl = this.image
          shareOPtions.title = this.title
          shareOPtions.href = this.href
          break
        case 1:
          shareOPtions.summary = this.shareText
          break
        case 2:
          shareOPtions.imageUrl = this.image
          break
        case 5:
          shareOPtions.imageUrl = this.image
          shareOPtions.title = this.title
          shareOPtions.miniProgram = {
            id: 'gh_33446d7f7a26',
            path: '/pages/tabBar/component/component',
            webUrl: 'https://uniapp.dcloud.io',
            type: 0
          }
          break
        default:
          break
      }
      // 如果是图文分享，且是ios平台，则压缩图片 
      if(shareOPtions.type === 0 && plus.os.name === 'iOS') {
        shareOPtions.imageUrl = await this.compress()
      }
      
      if (shareOPtions.provider === 'sinaweibo') {
        shareOPtions.type = 1
        shareOPtions.imageUrl = ''
      }
      // 如果是分享文字到qq，则必须加上href和title	
      if (shareOPtions.provider === 'qq') {
        shareOPtions.type = 1
        shareOPtions.href = this.href
        shareOPtions.title = this.title
      }
      uni.share(shareOPtions)
    },
    //压缩图片 图文分享要求分享图片大小不能超过20Kb
    compress() {
      let img = this.image
      return new Promise((res) => {
        var localPath = plus.io.convertAbsoluteFileSystem(img.replace('file://', ''))
        // 压缩size
        plus.io.resolveLocalFileSystemURL(localPath, (entry) => {
          // 可通过entry对象操作图片
          entry.file((file) => {
            // 压缩后size 大于20Kb
            if(file.size > 20480) {
              plus.zip.compressImage({
                src: img,
                dst: img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG'),
                width: '10%',
                height: '10%',
                quality: 1,
                overwrite: true
              }, (event) => {
                let newImg = img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG')
                res(newImg)
              }, function(error) {
                uni.showModal({
                  content: '分享图片太大,需要请重新选择图片!',
                  showCancel: false
                })
              })
            }
          })
        }, (e) => {
          uni.showModal({
            content: '分享图片太大,需要请重新选择图片!',
            showCancel: false
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.more-share-model{
	background:rgba(51, 51, 51, 0.49);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
}
.more-share{
	position: fixed;
	z-index: 110;
	bottom: 0;
	left: 0;
	right: 0;
	background: #FFFFFF;
}
.more-share-title,.more-share-bottom{
	font-size: 32upx;
	padding: 25upx;
}
.more-share-body{
	white-space: nowrap;
	width: 100%;
	height: 200upx;
	border-bottom: 1upx solid #EEEEEE;
	display: flex !important;
	line-height: 200upx !important;
}
.more-share-item{
	width: 25%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100%;
}
.more-share-item > view:first-child{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	font-size: 55upx;
	color: #FFFFFF;
}
.more-share-item > view:last-child{
	color: #7A7A7A;
}
.more-share-hover{
	background: #EEEEEE;
}
.more-share-wx{
	background: #2AD19B;
}
.more-share-pyq{
	background: #514D4C;
}
.more-share-wb{
	background: #EE5E5E;
}
.more-share-qq{
	background: #4A73BA;
}
</style>
