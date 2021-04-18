const express = require('express')
const lib = require('./lib')
const app = express.Router()
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()

app.get('/search/:page/:search', (req, res, next) => {
    let list = '<ol>'
    mysqli.query('select * from topic', (err, row) => {
        for (let i = 0; i < row.length; i++) {
            if(row[i].title.includes(req.params.search)) {
                list += `<li><a href = "/?id=${row[i].id}">${row[i].title}</a></li>`
            }
        }
        list += '</ol>'
        let data = new Array()
        let title, body = '', reply = ''
        title = 'search'
        if(!list.includes('<li>')) body = 'no search result'
        data.push(title, body, list, reply, false)
        lib.temp(data, '', req.session, (temp) => {
            res.status(200).send(temp)
        })
    })
})

module.exports = app