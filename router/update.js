var express = require('express')
const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
mysqli.connect()
var app = express.Router()

app.post('/update', (req, res, next) => {
    let post = req.body
    mysqli.query(`select * from topic where id="${post.id}"`, (err, row) => {
        let checked = ''
        let value = 0
        if (row[0].Anonymous == 1) {
            checked = 'checked'
            value = 1
        }
        let tem = `
            <h1>update</h1>
            <form action="/updateProcess" method="POST" id="form">
                <p><input type="text" name="title" placeholder="title" value="${row[0].title}"></p>
                <p><input type = "hidden" name = "id" value = "${row[0].id}"></p>
                <p><textarea name="description" placeholder="description" style="width:1050px;height:475px;resize:none;">${row[0].description}</textarea></p>
                <p>익명 여부 : <input type="checkbox" name="Anonymous" value="${value}" onclick="checking()" id="checkbox" ${checked}></p>
                <p><input type="submit" value="update"></p>
            </form>
            <script>
                function checking() {
                    let checkbox = document.getElementById('checkbox')
                    if(checkbox.checked === true) {
                        checkbox.value = 1
                    } else {
                        checkbox.value = 0
                    }
                }
            </script>
        `
        res.status(200).send(tem)
    })
})

module.exports = app