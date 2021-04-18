const express = require('express')
const lib = require('./lib')
const app = express.Router()
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()

app.post('/typeReply_process', (req, res) => {
    let post = req.body
    if(post.reply == '' || post.boardId == '') return res.writeHead(302, {Location: `/`}).end()
    let params = [post.boardId, post.ref_reply_id, post.reply, req.session.nickname, post.Anonymous]
    mysqli.query(`INSERT INTO reply (boardId, ref_reply_id, replyDescription, name, Anonymous) VALUES(?, ?, ?, ?, ?)
                `, params, (err, row) => {
        if (err) {
            lib.logging_err(err)
            console.log(err)
        } 
        res.writeHead(302, { Location: `/?id=${post.boardId}` }).end()
    })
})

module.exports = app