const express = require('express')
const lib = require('../router/lib')
const app = express.Router()
const mysql = require('mysql')
const crypto = require('crypto')
const { logging_err } = require('../router/lib')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })

mysqli.connect()
app.post('/login_process', (req, res, next) => {
    let post = req.body
    if(post.nickname == '' || post.password =='') return res.writeHead(302, {Location: '/login/login'}).end()
    mysqli.query(`Select * from account where nickname="${post.nickname}"`, (err, row) => {
        if(err) return logging_err(err)
        if(post.nickname != row[0].nickname) return res.status(200).send('아이디가 틀렸습니다. <a href="/login/login">로그인창으로 돌아가기</a>')
        let pwd = crypto.createHash('sha512').update(post.password).digest('base64')
        if(row[0].password != pwd) return res.status(200).send('비밀번호가 틀렸습니다. <a href="/login/login">로그인창으로 돌아가기</a>')
        req.session.login = true
        req.session.nickname = post.nickname
        req.session.id = row[0].id
        res.writeHead(302, { Location: `/` }).end()
    })
})

module.exports = app