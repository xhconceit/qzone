const path = require('path')
const inquirer = require('inquirer')
const {fsExistsSync,renameSync} = require('./util/index')
const {saveReadFile} = require('./util/writeFile')
const FileType = require('file-type')

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

inquirer
	.prompt({
		name: 'qq',
		type: 'input',
		message: 'qq',
		validate: validateNumber
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
		let datatime = Date.now()
		let ii = 0
		function extFor() {
			let filepath = imgs.splice(0,15).map(ele=>{
				return getType(ele.path).then(res=>{
					return {
						path: ele.path,
						...res
					}
				})
			})
			Promise.all(filepath)
				.then(res=>{
					//console.log(res)
					ii++
					console.log(ii)
					res.forEach(ele=>{
						renameSync(ele.path,ele.path+'.'+ele.ext)
					})
					if (imgs.length>0) {
						extFor()
					} else {
						console.log(Date.now()-datatime)
					}
				})

		}
		extFor()
	})

function  getType(path){
	return FileType.fromBuffer(saveReadFile(path))
}

