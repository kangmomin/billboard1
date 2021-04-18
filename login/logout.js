const express = require('express')
const lib = require('../router/lib')
const app = express.Router()

app.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
    req.session;
    })
    res.redirect('/')
})

module.exports = app