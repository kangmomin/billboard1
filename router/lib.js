const mysql = require('mysql')
const mysqli = mysql.createConnection({ host: "127.0.0.1", user: "root", password: "#koldin13579", database: "test", port: 3306 })
const fs = require('fs')
const crypto = require('crypto')
const { reject } = require('async')
mysqli.connect()

module.exports = {
    logging_err: function (err) {
        fs.appendFile('./log.txt', `[${Date()}] : ${err} \n`, (err) => {
        })
    },
    showList: function (rows, callback) {
        try {
            let list = '<ol>'
            let i = 0
            while (i < rows.length) {
                list += `<li><a href = "/?id=${rows[i].id}">${rows[i].title}</a></li>`
                i++
            }
            list += '</ol>'
            callback(list)
        } catch (err) {
            this.logging_err(err)
        }
    },
    temp: function (data, getId = '', session = '', callback) {
        let title = data[0], body = data[1], list = data[2], reply = data[3], isOwnUser = data[4], madeBy = ''
        let Btn = ''
        if(data.length > 5) {
            madeBy = data[5]
        }
        let logBtn = '<a href="/login">login</a>'
        let typeReply = ''
        if (getId !== '' && session.nickname) {
            logBtn = '<a href="/logout">logout</a>\n<a href="/create">create</a><br />'
            typeReply = `
            <form action="/typeReply_process" method="post">
                <p><input type="text" placeholder="댓글을 입력해 주십시오." name="reply"></p>
                <p>익명 여부 : <input type="checkbox" name="Anonymous" id="checkbox" onclick="checking()" value="0"></p>
                <input type="hidden" value="${getId}" name="boardId">
                <input type="hidden" value="0" name="ref_reply_id">
                <p><input type="submit" value="작성 완료"></p>
            </form>
            <script>
                function show(id) {
                    let ref_reply = document.getElementsByClassName('ref_reply')
                    let reply = ''
                    for(var i = 0; i < ref_reply.length; i++){
                        ref_reply[i].style.display = "none"
                    }
                    if(reply = document.getElementById(id)) reply.style.display = 'block'
                }
            </script>
            `
        }
        if(getId !== '' && isOwnUser === true) {
            Btn = `
            <form action="/deleteProcess" method="POST">
                <input type="hidden" name="id" value="${getId}">
                <input type="submit" value="delete">
            </form>
            <form action="/update" method="POST">
                <input type="hidden" name="id" value="${getId}">
                <input type="submit" value="update">
            </form>
          `
        }
        let templete = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <style>
        ol{
            border-top:1px solid black;
        }
        #reply > h3{
            margin: 0px;
        }
        #reply{
            border: 1px solid black;
            margin-top: 10px;
        }
        .flex{
            display: flex;
        }
        h4, h6{
            margin-top: 0px;
        }
      </style>
      <div class="flex">
        <h1><a href="/">WEB</a></h1>
        <input id="search" type="text" name="search">
        <h3 onclick="searching()">  검색</h3>
        <script> 
        function searching() {
            let search = document.getElementById('search').value
            location.href = '/search/1/' + search
        }

        function checking() {
            let checkbox = document.getElementById('checkbox')
            if(checkbox.checked === true) {
                checkbox.value = 1
            } else {
                checkbox.value = 0
            }
        }

        
        </script>
        </div>
      ${logBtn}
      ${Btn}
      <h1>${title}</h1>
      ${madeBy}
      ${body}
      ${typeReply}
      ${reply}
      ${list}
    </body>
    </html>
    `
        return callback(templete)
    },
    replyList: function (boardId, callback) {
        if(boardId === undefined) {
            return callback('')
        } else {
            mysqli.query(`select * from reply where boardId = '${boardId}'`, async (err, rows) => {
                let _list = '<div id = "reply">'
                if (err) {
                    this.logging_err(err)
                    console.log(err)
                }
                let i = 0
                while (i < rows.length) {
                    if (rows[i].Anonymous === 0 && rows[i].ref_reply_id == 0) {
                        _list += `<div class="flex"><h3>${rows[i].name} : ${rows[i].replyDescription}</h3><h6 onclick="show(${rows[i].id})">답글 달기</h6></div>`
                    } else if(rows[i].ref_reply_id == 0) {
                        _list += `<div class="flex"><h3>익명 : ${rows[i].replyDescription}</h3><h6 onclick="show(${rows[i].id})">답글 달기</h6></div>`
                    }
                    _list += `
                <form action="/typeReply_process" method="post" id="${rows[i].id}" class="ref_reply" style="display: none; border: 1px solid black;">
                    <p><input type="text" placeholder="댓글을 입력해 주십시오." name="reply"></p>
                    <input type="hidden" value="0" name="Anonymous">
                    <input type="hidden" value="${rows[i].id}" name="ref_reply_id">
                    <p><input type="hidden" value="${boardId}" name="boardId"></p>
                    <p><input type="submit" value="작성 완료"></p>
                </form>
                `
                    let reply = await ref_reply(rows, i, boardId) 
                    _list += reply
                    i++
                }
                _list += '</div>'
                if(rows <= 0) {
                    _list = ''
                }
                return callback(_list)
            })
        }
    }
}

const ref_reply = function(rows, i, getId) {
    return new Promise((resolve, reject) => {
        let _list = ''
        mysqli.query(`select * from reply where ref_reply_id = '${rows[i].id}'`, (err, row) => {
            if (err) {
                this.logging_err(err)
                console.log(err)
            }
            let j = 0
            while (j < row.length) {
                if (row[j].Anonymous === 0) {
                    _list += `<div class="flex"><h4> ↳ ${row[j].name} : ${row[j].replyDescription}</h4><h6 onclick="show(${row[i].id})">답글 달기</h6></div>`
                } else if (row[j].Anonymous === 1) {
                    _list += `<div class="flex"><h4> ↳ 익명 : ${row[j].replyDescription}</h4><h6 onclick="show(${row[i].id})">답글 달기</h6></div>`
                }
                _list += `
                <form action="/typeReply_process" method="post" id="${row[i].id}" class="ref_reply" style="display: none; border: 1px solid black;">
                    <p><input type="text" placeholder="댓글을 입력해 주십시오." name="reply"></p>
                    <input type="hidden" value="${rows[i].id}" name="ref_reply_id">
                    <input type="hidden" value="0" name="Anonymous">
                    <p><input type="hidden" value="${getId}" name="boardId"></p>
                    <p><input type="submit" value="작성 완료"></p>
                </form>
                `
                j++
            }
            resolve(_list)
        })
    })
}  