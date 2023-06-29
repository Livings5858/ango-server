var path = require('path');
const multer = require('multer')

// 上传文件
upload = (req, res)=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../public/upload'))
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    const upload = multer({ storage: storage }).single('file')
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // 发生错误
            res.send({ status: 0, msg: '上传失败' })
        } else if (err) {
            // 发生错误
            res.send({ status: 0, msg: '上传失败' })
        } else {
            // 一切都好
            res.send({ status: 1, msg: '上传成功' })
        }
    })
}

module.exports = {
    upload
}
