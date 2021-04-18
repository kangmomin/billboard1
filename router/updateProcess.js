var express = require('express')
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()
var app = express.Router()

app.post('/updateProcess', (req, res, next) => {
    let post = req.body
    let des = post.description.replace(/(<([^>]+)>)/ig,"")
    let title = post.title.replace(/(<([^>]+)>)/ig,"")
    mysqli.query(`update topic set title = "${title}", description = "${des}", Anonymous = "${post.Anonymous}" where id = "${post.id}"`, (err, row) => {
        res.writeHead(302, { Location: `/?id=${post.id}` }).end()
    })
})

module.exports = app