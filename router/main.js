var express = require('express')
const mysql = require('mysql')
const lib = require('./lib')
const url = require('url')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()
var app = express.Router()

app.get('/', (req, res, next) => {
    mysqli.query(`Select * from topic `, (err, row) => {
        let _url, title, body
        let data = new Array()
        _url = req.url
        let queryData = url.parse(_url, true).query

        if (queryData.id === undefined) {// 메인 페이지
            title = 'Welcome'
            body = "Welcome to koldin's billboard"
            lib.showList(row, list => {
                data.push(title, body, list, '', false)
                lib.temp(data, queryData.id, req.session, result => {
                    res.status(200).send(result)
                })
            })
        } else {// 쿼리스트링 id값이 있을때 페이지
            mysqli.query(`Select * from topic where id = '${queryData.id}'`, (err, rows) => {
                if (err || rows[0] === undefined || rows[0] === '') {
                    if (err == null) {
                        lib.logging_err('none id')
                    } else {
                        lib.logging_err(err)
                    }

                    res.status(404).send('Not Found!<br>check the link again. <a href = "/">click here</a> to go main site')
                } else {
                    title = `${rows[0].title}`
                    body = `<h3>${rows[0].description}</h3>`
                    madeBy = `작성자 : ${rows[0].name}`
                    boolean = false
                    if (rows[0].Anonymous == 1) {
                        madeBy = `작성자 : 익명`
                    }
                    if(rows[0].name == req.session.nickname) {
                        boolean = true
                    }
                    lib.showList(row, list => {
                        lib.replyList(queryData.id, reply => {
                            data.push(title, body, list, reply, boolean, madeBy)
                            lib.temp(data, queryData.id, req.session, result => {
                                res.status(200).send(result)
                            })
                        })
                    })
                }
            })
        }
    })
})
module.exports = app