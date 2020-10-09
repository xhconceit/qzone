const superagent = require('superagent')

let URL = 'https://user.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/fcg_list_album_v3'+
'?callback=shine0_Callback'+
'&t=348993097'+
'&appid=4'+
'&inCharset=utf-8'+
'&outCharset=utf-8'+
'&source=qzone'+
'&plat=qzone'+
'&format=jsonp'+
'&notice=0'+
'&filter=1'+
'&handset=4'+
'&pageNumModeSort=40'+
'&pageNumModeClass=15'+
'&needUserInfo=1'+
'&idcNum=4'+
'&callbackFun=shine0'



function shine0_Callback(data) {
	let album_list = []
	if (data.code === 0) {
		let albumList = []
		if (data.data.albumListModeSort) {
			albumList = data.data.albumListModeSort
		} else if (data.data.albumListModeClass) {
			data.data.albumListModeClass.forEach((element, index) => {
				albumList = albumList.concat(element.albumList)
			})
		} else {
			console.log(`获取相册失败  qq：${hostUin}, 调试链接：https://user.qzone.qq.com/${hostUin}/4`)
		}
		albumList.forEach((element, index) => {
			album_list.push({
				total: element.total,
				topicId: element.id,
				name: element.name
			})
		})
	}
	return album_list
}

module.exports = function (hostUin, uin, g_tk, cookie) {
	let url = URL + `&hostUin=${hostUin}&uin=${uin}&g_tk=${g_tk}`
	return superagent
		.get(url)
		.set('Cookie', cookie)
		.then(res => {
			let ablums = eval(res.body.toString())
			return ablums
		})
}
