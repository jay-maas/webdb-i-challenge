const express = require('express')

const Accounts = require('../data/accounts-model.js')

const router = express.Router()

router.use(express.json())

module.exports = router