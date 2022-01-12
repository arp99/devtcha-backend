const express = require('express')
const { loginUser } = require('../Controllers/login.controller')
const router = express.Router()

router.route("/")
    .post( loginUser )

module.exports = router