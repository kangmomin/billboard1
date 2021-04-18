const express = require('express')
const app = express()
const mysql = require('mysql')
const main = require('./router/main')
const create = require('./router/create')
const update = require('./router/update')
const deleteProcess = require('./router/deleteProcess')
const createProcess = require('./router/createProcess')
const updateProcess = require('./router/updateProcess')
const _login = require('./login/login')
const _login_process = require('./login/login_process')
const create_account = require('./login/create_account')
const create_account_process = require('./login/create_account_process')
const typeReply_process = require('./router/typeReply_process')
const logout = require('./login/logout')
const search = require('./router/search')
const favicon = require('serve-favicon')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bp = require('body-parser')//use middle ware to get post
const compression = require('compression')//middle warre compresser
const path = require('path')

const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })

//middle ware는 쉽게말하면 동기함수인데 이걸 req값에 req.list += a이런 식으로 넣어주는 것 이다. callback대신 next를 쓰며 마지막 줄에 next()를 넣어줘야함

app.post('*', bp.urlencoded({ extended: false})) //bp가 미들웨어를 만들어냄 req.body로 사용 가능함
app.use(favicon(path.join(__dirname, 'public', 'favicon1.ico')))

app.use(compression())//file을 압축해서 전송한 후 클라이언트에 도착시 file을 암축해제함(gzip)

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))

//app.get으로 바꾸면 get방식으로 요청할때만 post일땐 post방식일때만 작동한다
// app.use('*', function a() {
//     console.log(a)
//     next()
// }, function b() {
//     console.log(b)
//     next()
// }) <== 이와 같이 한 미들웨어 app작업에서 컴마를 통해 여러 미들웨어를 간단하게 작성할수 있다.


mysqli.connect()

app.get('/', main)

app.get('/login', _login)

app.get('/create_account', create_account)

app.get('/create', create)

app.get('/logout', logout)

app.post('/update', update)

app.get('/search/:page/:search', search)

app.post('/deleteProcess', deleteProcess)

app.post('/createProcess', createProcess)

app.post('/updateProcess', updateProcess)

app.post('/login_process', _login_process)

app.post('/create_account_process', create_account_process)

app.post('/typeReply_process', typeReply_process)

app.listen(8080, () => {
    console.log('server is ready')
})

app.get('*', (req, res) => {
    res.status(404).send('Not Found!<br>check the link again. <a href = "/">click here</a> to go main site')
})