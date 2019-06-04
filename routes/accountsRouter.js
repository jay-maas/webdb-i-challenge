const express = require('express')

const Accounts = require('../data/accounts-model.js')

const router = express.Router()

router.use(express.json())

router.get('/', async (req, res) => {
    try {
        const accounts = await Accounts.find()
        res.status(200).json(accounts)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id',  validateAccountId, async (req, res) => {
    try {
        const account = await Accounts.findById(req.account.id)
        res.status(200).json(account)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post('/', validateAccount, async (req, res) => {
    try {
        const newAccount = await Accounts.add(req.accountValid)
        res.status(201).json(newAccount)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.put('/:id', validateAccountId, validateAccount, async (req, res) => {
    try {
        const updatedAccount = await Accounts.update(req.account.id, req.accountValid)
        const numberUpdated = updatedAccount
        res.status(200).json({ message: `Number of account(s): ${numberUpdated}` })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.delete('/:id', validateAccountId, async (req, res) => {
    try {
        const deleted = await Accounts.remove(req.params.id)
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.use(express.json())

async function validateAccountId(req, res, next) {
    const account = await Accounts.findById(req.params.id)
    if (account) {
        req.account = account
        next()
    } else {
        res.status(404).json({
            error: "Could not find a account by that ID"
        })
    }
}

function validateAccount(req, res, next) {
    if (!isEmpty(req.body)) {
        if (req.body.name && req.body.budget) {
            req.accountValid = {
                name: req.body.name,
                budget: req.body.budget
            }
            next()
        } else {
            res.status(400).json({
                errorMessage: 'Missing required name and/or budget. This schema requires both. Please do not submit any other key:values in this post request!'
            })
        }
    } else {
        res.status(400).json({
            errorMessage: 'Missing account data.'
        })
    }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)
        )
            return false
    }
    return true
}

module.exports = router