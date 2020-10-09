const path = require('path')
const inquirer = require('inquirer')
const albumList = require('./album_list')
const picKey = require('./pic_key')
const photos = require('./photos')
const { mkdirsSync } = require('./util/index')
const { saveFileSync } = require('./util/writeFile')

// 判断数据是否是数字
function validateNumber (val) {
	val = val.trim()
	if (val.length<6) {
		return false
	}
	for (let i = 0, len = val.length; i < len; i++) {
		let charCodeAt = val[i].charCodeAt()
		if (charCodeAt >= 48 && charCodeAt <= 57) {
			return true
		} else {
			return false
		}
	}
}
// 判断数据是否为空
function validateEmpty(val){
	if (val.trim().length>0) {
		return true
	} else {
		return false
	}
}

// 1 uin
// 2 hostUin
// 3 g_tk
// 4 cookie
// 问题
const questions = [
	{
		name: 'uin',
		type: 'input',
		message: 'qq',
		validate: validateNumber
	},
	{
		name: 'hostUin',
		type: 'input',
		message: 'image qq',
		validate: validateNumber
	},
	{
		name: 'g_tk',
		type: 'input',
		message: 'g_tk',
		validate: validateEmpty
	},
	{
		name: 'cookie',
		type: 'input',
		message: 'qq cookie',
		validate: validateEmpty
	}
]

inquirer.prompt(questions).then(answers=>{
	let uin = answers['uin']
	let hostUin = answers['hostUin']
	let g_tk = answers['g_tk']
	let cookie = answers['cookie']
	// 获取相册列表
	albumList(hostUin, uin, g_tk, cookie)
		.then(albums => {
			// 选择下载的相册
			albums = albums.map(ele => {
				return {
					name: `${ele.name} (${ele.total})`,
					value: ele
				}
			})
			return inquirer
				.prompt({
					type: 'checkbox',
					name: 'albums',
					message: 'change albums',
					choices: albums
				})
		})
		.then(albums => {
			// 获取相册的 KEY 值
			let promises = albums['albums'].map(ele => {
				return picKey(hostUin, uin, ele.topicId, g_tk, cookie)
					.then(key => ({key,total:ele.total, topicId: ele.topicId, name: ele.name}))
			})
			// 获取全部的相册 KEY 值
			return Promise.all(promises)
		})
		.then(keys => {
			// 获取相册的图片路径
			let promises = keys.map(key => {
				return photos(hostUin, uin, key.topicId, key.key, g_tk, cookie)
					.then(photoList => {
						return {
							name: key.name,
							photos: photoList,
							total: key.total
						}
					})
			})
			// 获取全部的相册的全部图片路径
			return Promise.all(promises)
		})
		.then(photo=>{
			// 图片路径
			let downloadImages = []
			// 相册里图片数量不对
			let noImage = []

			photo.forEach(imageItem => {
				if (imageItem.photos.length != imageItem.total) {
					noImage.push(imageItem)
				}
			})

			if (noImage.length>0) {
				noImage.forEach(item => {
					console.log(`${item.name}::    download image items ::: ${item.photos.length}    total ::: ${item.total}`)
				})
				inquirer
					.prompt({
						type: 'confirm',
						message:'相册里图片数量不对,是否下载图片',
						name:'download'
					})
					.then(answers=>{
						if (!answers['download']) {
							return false
						}
					})
			}
			photo.forEach(item => {
				console.log(`${item.name}::   total ::: ${item.total}`)
				let itemPath = path.resolve(__dirname, 'images', hostUin, item.name)
				if (mkdirsSync(itemPath)) {
					item.photos.forEach((url, index)=>{
						downloadImages.push({url,path:path.join(itemPath, index+'')})
					})
				}
			})
			return downloadImages
		})
		.then(imgs => {
			saveFileSync(path.resolve(__dirname,'images',hostUin,'img.json'),JSON.stringify(imgs))
		})
})
