const path = require('path')
const inquirer = require('inquirer')
const superagent = require('superagent')
const {fsExistsSync} = require('./util/index')
const {saveReadFile,saveImage} = require('./util/writeFile')

let types = {
	'image/gif': '.gif',
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'video/mp4': '.mp4'
}

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


function  getImage(url, path) {
	return superagent
		.get(url)
		.then(res => {

			//let extname = types[res.headers['content-type']]
			//if (!extname) {
			//	extname = '.' + res.headers['content-type'].replace('/', '-')
			//}
			return {
				path: path,
				url,
				body: res.body,
				//type: res.headers['content-type'],
				//extname: extname
			}
		})
		.catch(err=>{
			return {
				url,
				path,
				err
			}
		})
}

inquirer
	.prompt({
		name: 'qq',
		type: 'input',
		message: 'qq',
		validate:validateNumber
	})
	.then(answers=>{
		let qq = answers['qq']
		let file = path.resolve(__dirname,'images',qq)
		let imgsPath = path.join(file,'img.json')
		if (!fsExistsSync(imgsPath)) {
			console.log('没有 img.json')
		}
		let imgs = JSON.parse(saveReadFile(imgsPath).toString())
		console.log(imgs.length)
		imgs = imgs.filter(e => {
			return !fsExistsSync(e.path)
		})
		console.log(imgs.length)
		let ii = 0
		function forImg(){
			let downimgs = imgs
				.splice(0,10)
				.map(ele=>{
					return getImage(ele.url, ele.path).then(res => {
						return saveImage(res.path, res.url, res.body)
					}).catch(err=>{
						console.log('err saveImage')
						console.log(err)
					})
				})

			Promise.all(downimgs).then(resolve=>{
				ii++
				console.log(ii)
				if (imgs.length>0) {
					forImg()
				}
			}).catch(err=>{
				console.log('saveImage err all')
				console.log(err)
			})
		}

		forImg()
	})

