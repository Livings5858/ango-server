const jwt = require("jsonwebtoken")
const config = require("../config")
const secretKey = config.secretKey
const bycrypt = require('bcryptjs')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: config.mysql_host,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_database
})

// 数据表格式 id, username, password, avatar, is_deleted
// 新建数据表
// CREATE TABLE users (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     username VARCHAR(200) NOT NULL,
//     password VARCHAR(200) NOT NULL,
//     avatar VARCHAR(1000),
//     is_deleted BIT DEFAULT 0
// )

// 注册
register = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const avatar = req.body.avatar
    const sql = 'SELECT * FROM users WHERE username = ?'
    db.query(sql, username, (err, result) => {
        if (err) {
            return res.status(401).json({
                message: '用户名或密码错误'
            })
        }
        if (result.length !== 0) {
            return res.status(401).json({
                message: '用户名已存在'
            })
        }
        const hash = bycrypt.hashSync(password, 10)
        const sql = 'INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)'
        db.query(sql, [username, hash, avatar], (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: '注册失败'
                })
            }
            res.json({
                message: '注册成功'
            })
        })
    })
}

//使用数据库验证登录
login = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const sql = 'SELECT * FROM users WHERE username = ?'
    db.query(sql, username, (err, result) => {
        if (err) {
            console.log('1:'+err)
            return res.status(401).json({
                message: '用户名或密码错误'
            })
        }
        if (result.length === 0) {
            console.log('2:'+err)
            return res.status(401).json({
                message: '用户名或密码错误'
            })
        }
        const compareResult = bycrypt.compareSync(password, result[0].password)
        if (!compareResult) {
            console.log('3:'+err)
            return res.status(401).json({
                message: '用户名或密码错误'
            })
        }
        const user = { username: username }
        const token = jwt.sign(user, secretKey, { expiresIn: '24h' })
        res.json({
            message: '登录成功',
            token: token
        })
    })
}

userInfo = async (req, res) => {
    const sql = 'SELECT * FROM users WHERE username = ? AND is_deleted = 0'
    db.query(sql, req.user.username, (err, result) => {
        if (err) {
            return res.status(401).json({
                message: '获取用户信息失败'
            })
        }
        if (result.length === 0) {
            return res.status(401).json({
                message: '获取用户信息失败'
            })
        }
        res.json({
            username: result[0].username,
            avatar: result[0].avatar
        })
    })
}

module.exports = {
    login,
    userInfo,
    register
}
