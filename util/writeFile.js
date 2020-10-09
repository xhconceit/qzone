const fs = require('fs')
function saveImage(path, url, buffer) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, buffer,(err) => {
			if (!err) {
				resolve(path)
			} else {
				reject({path,url})
			}
		})
	})
}

function saveFileSync(path, str){
	fs.writeFileSync(path, str)
}

function saveReadFile(path) {
	return fs.readFileSync(path)
}

module.exports = {
	saveFileSync,
	saveImage,
	saveReadFile
}
