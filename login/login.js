const express = require('express')
const lib = require('../router/lib')
const app = express.Router()

app.get('/login', (req, res, next) => {
    let data = new Array()
    let title = 'login'
    let body = `
    <form action="/login_process" method="POST" id='login_id'>
        닉네임  :  <input type="text" name="nickname" placeholder="홍길동">
        <br />
        비밀번호 : <input type="password" name="password" placeholder="password">
        <br />
        <input type="submit" value="login">
    </form>
    <br />
    <h3>만약 계정이 없다면 <a href="/create_account">여기</a>를 눌러 계정을 만드세요!</h3>
    `
    data.push(title, body, '', '')
    lib.temp(data, '', '', (temp) => {
        res.status(200).send(temp)
    })
})

module.exports = app