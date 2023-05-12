const express = require('express')
const jsonParser = express.json()
const recommendationController = require('../controllers/recommendationController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/recommendation')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']
    })

module.exports = router