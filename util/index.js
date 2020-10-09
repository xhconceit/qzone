const fs = require('fs')
const path = require('path')

function isDirectory(path){
	return fs.existsSync(path)
}

function newFile(path) {
	if (!isDirectory(path)) {
		try {
			fs.mkdirSync(path)
			return true
		} catch (err) {
			console.log('string')
			return false
		}
	}
	return true
}



//递归创建目录 异步方法
function mkdirs(dirname, callback) {
	fs.exists(dirname, function (exists) {
		if (exists) {
			callback();
		} else {
			//console.log(path.dirname(dirname));
			mkdirs(path.dirname(dirname), function () {
				fs.mkdir(dirname, callback);
			});
		}
	});
}

//递归创建目录 同步方法
function mkdirsSync(dirname) {
	//console.log(dirname);
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}


function fsExistsSync (path) {
	try {
		fs.accessSync(path,fs.F_OK)
	} catch (e) {
		return false
	}
	return true;
}

function renameSync(oldPath,newPath){
	return fs.renameSync(oldPath, newPath)
}

module.exports = {
	newFile,
	isDirectory,
	mkdirsSync,
	mkdirs,
	fsExistsSync,
	renameSync
}

