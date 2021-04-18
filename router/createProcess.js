var express = require('express')
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()
var app = express.Router()

app.post('/createProcess', (req, res, next) => {
    let post = req.body
    if(post.title == '' || post.description =='') return res.writeHead(302, {Location: '/create'}).end()
    let des = post.description.replace(/(<([^>]+)>)/ig,"")
    let title = post.title.replace(/(<([^>]+)>)/ig,"")
    let params = [`${title}`, `${des}`, req.session.nickname, `${post.Anonymous}`]
    mysqli.query(`INSERT INTO topic (title, description, name, Anonymous) VALUES(?, ?, ?, ?)
                `, params, (err, row) => {
        if (err) throw lib.logging_err(err)
        res.writeHead(302, { Location: `/?id=${row.insertId}` }).end()
    })
})

module.exports = app