var express = require('express')
var app = express.Router()

app.get('/create', (req, res, next) => {
    let tem = `
        <h1>create</h1>
        <form action="/createProcess" method="POST" id="form">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description" style="width:1050px;height:475px;resize:none;"></textarea></p>
            <p>익명 여부 : <input type="checkbox" name="Anonymous" id="checkbox" onclick="checking()" value="0"></p>
            <p><input type="submit" value="create"></p>
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

module.exports = app