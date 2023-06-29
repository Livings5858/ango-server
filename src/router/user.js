const express = require("express")
const router = express.Router()
const userHandler = require("../router_handler/user")
const fileHandler = require("../router_handler/file")

router.post('/api/register', userHandler.register)
router.post('/api/login', userHandler.login)
router.get('/api/userinfo', userHandler.userInfo)
router.post('/api/upload', fileHandler.upload)

module.exports = router



