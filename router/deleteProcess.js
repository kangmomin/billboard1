var express = require('express')
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()
var app = express.Router()

app.post('/deleteProcess', (req, res, next) => {
    let post = req.body
    mysqli.query(`delete from topic where id = "${post.id}"`, () => {
        mysqli.query(`delete from reply where boardId = "${post.id}"`, () => {
            res.writeHead(302, { Location: `/` }).end()
        })
    })
})

module.exports = app