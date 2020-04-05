/*
 * @Author: SunJianFeng
 * @LastEditors: SunJianFeng
 * @Email: jianfengtheboy@163.com
 * @Date: 2019-12-21 00:13:04
 * @LastEditTime: 2020-04-05 18:50:05
 * @Description: lib.js
 */
import $http from './request.js'

// 网络监听
const NetWork = {
  // 网络状态
	isConnect: false,
	// 监听网络状态
	On() {
		// 获取当前网络状态
		uni.getNetworkType({
			success: (res) => {
				if(res.networkType !== 'none') {
          this.isConnect = true
          return
        }
				uni.showToast({
					icon: 'none',
					title: '请先连接网络',
				})
			}
		})
		// 监听网络状态变化
		uni.onNetworkStatusChange((res) => {
			this.isConnect = res.isConnected
			if(!res.isConnected) {
				uni.showToast({
					icon: 'none',
					title: '您目前处于断网状态',
				})
			}
		})
	}
}

// app更新
const Update = function(showToast = false) {
  // #ifdef APP-PLUS  
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {  
		$http.post('/update', {
			ver: widgetInfo.version, 
		}).then((res) => {
			let [err, result] = res
			// 错误处理
			if (!$http.errorCheck(err, result)) return
			// 成功
			var data = result.data.data
			if (!data.url) {
				// 无需更新
				if (showToast) {
					return uni.showToast({ title: '无需更新', icon: 'none' })
				}
			}
			uni.showModal({
				title: '发现新的版本',
				content: '最新版本：'+ data.version,
				cancelText: '放弃更新',
				confirmText: '立即更新',
				success: res => {
					if(res.confirm) {
						uni.downloadFile({
							url: data.url,
							success: (downloadResult) => {
								if (downloadResult.statusCode === 200) {
									plus.runtime.install(downloadResult.tempFilePath, {
										force: false
									}, function() {
										plus.runtime.restart()
									}, function(e) {
										console.error('安装失败...')
									})
								}
							}
						})
					}
				}
			})
		})
	})
	// #endif  
}

export default {
  NetWork,
  Update
}