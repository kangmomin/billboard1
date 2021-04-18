const express = require('express')
const lib = require('../router/lib')
const app = express.Router()

app.get('/create_account', (req, res, next) => {
    let data = new Array()
    let title = '회원가입'
    let body = `
    <form action="/login/create_account_process" method="POST" id='login_id'>
        닉네임  :  <input type="text" name="nickname" placeholder="홍길동">
        <br />
        이메일  :  <input type="email" name="email" placeholder="example@email.com">
        <br />
        비밀번호 : <input type="password" name="password" placeholder="password">
        <br />
        <input type="submit" value="회원가입">
    </form>
    <br />
    `
    data.push(title, body, '', '')
    lib.temp(data, '', '', (temp) => {
        res.status(200).send(temp)
    })
})

module.exports = app