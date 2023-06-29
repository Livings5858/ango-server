const express = require('express')
const path = require('path')
const expressJwt = require('express-jwt')
const cors = require('cors')
const app = express()
const config = require('./config')
const secretKey = config.secretKey
const port = config.port

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 验证token, //正则匹配，以 /api/ 开头的login和register不需要验证token
app.use(expressJwt({
    secret: secretKey
}).unless({
    path: [/^\/api\/login/, /^\/api\/register/]
}))

app.use('upload', express.static(path.join(__dirname, '..', 'public/upload')))

const userRouter = require('./router/user')
app.use(userRouter)

// error 中间件，token 无效时的处理
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            message: 'token 无效'
        })
    }
}
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
)

