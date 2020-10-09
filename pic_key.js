const superagent = require('superagent')
const URL = 'https://h5.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/cgi_list_photo'+
'?callback=shine0_Callback'+
'&mode=0'+
'&idcNum=4'+
'&noTopic=0'+
'&pageStart=0'+
'&pageNum=30'+
'&skipCmtCount=0'+
'&singleurl=1'+
'&batchId='+
'&notice=0'+
'&appid=4'+
'&inCharset=utf-8'+
'&outCharset=utf-8'+
'&source=qzone'+
'&plat=qzone'+
'&outstyle=json'+
'&format=jsonp'+
'&json_esc=1'+
'&question='+
'&answer='+
'&callbackFun=shine0'

function shine0_Callback(data){
	let picKey = ''
	if (data.code == 0) {
		if (data.data.photoList || data.data.photoList.length > 1) {
			picKey = data.data.photoList[0].lloc
		}
	} else {
		console.log('获取图片列表失败')
	}
	return picKey
}

module.exports = function (hostUin, uin, topicId, g_tk, cookie) {
	let url = URL + `&hostUin=${hostUin}&uin=${uin}&topicId=${topicId}&g_tk=${g_tk}`
	return superagent
		.get(url)
		.set('Cookie', cookie)
		.then(res => {
			return eval(res.body.toString())
		})
}

