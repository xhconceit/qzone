const superagent = require('superagent')

const URL = 'https://h5.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/cgi_floatview_photo_list_v2'+
'?callback=viewer_Callback'+
'&shootTime='+
'&cmtOrder=1'+
'&fupdate=1'+
'&plat=qzone'+
'&source=qzone'+
'&cmtNum=10'+
'&likeNum=5'+
'&inCharset=utf-8'+
'&outCharset=utf-8'+
'&callbackFun=viewer'+
'&offset=0'+
'&number=15'+
'&appid=4'+
'&sortOrder=1'+
'&showMode=1'+
'&need_private_comment=1'+
'&postNum=1000'


module.exports = function(hostUin, uin, topicId, picKey, g_tk, cookie) {

	return new Promise((resolve, reject) => {

		let AllPhotos = []

		function viewer_Callback(data) {
			if (data.code == 0) {
				let photos = data.data.photos
				if (photos) {
					AllPhotos = AllPhotos.concat(photos.map(element => {
						let url = element.raw_upload === 1 ? element.raw : element.url
						return url
					}))
					let lastPhotoPicKey = photos[photos.length - 1].picKey
					getPhotos(hostUin, uin, topicId, lastPhotoPicKey, g_tk, cookie)
				} else {
					console.log(AllPhotos.length)
					resolve(AllPhotos)
				}
			} else {
				console.log('获取全部图片失败')
				console.log(data)
				reject(data)
			}
		}

		function getPhotos(hostUin, uin, topicId, picKey, g_tk, cookie){
			let prevNum = AllPhotos.length == 0 ? 9 : 0
			let isFirst = AllPhotos.length == 0 ? 1 : ''

			let url = URL + `&hostUin=${hostUin}&uin=${uin}&topicId=${topicId}&picKey=${picKey}&g_tk=${g_tk}&prevNum=${prevNum}&isFirst=${isFirst}`
			superagent
				.get(url)
				.set('Cookie', cookie)
				.then(result => {
					eval(result.body.toString())
				}).catch(err => {
					console.log('大概是 网络 cookie g_tk 的问题')
					console.log(url)
				})
		}

		getPhotos(hostUin, uin, topicId, picKey, g_tk, cookie)


	})
}

