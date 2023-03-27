const express = require('express')
const jsonParser = express.json()
const tagController = require('../controllers/tagController.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/tags/id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let id = req.params.userId

        if(id != '' && id != undefined) {
            const tagsData = await tagController.listTagByUserId(id)

            if(tagsData) {
                statusCode = tagsData.status
                message = tagsData.message
            } else {
                statusCode = 404
                message = MESSAGE_ERROR.NOT_FOUND_DB
            }
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/tags')
    .get(async(req, res) => {
        let statusCode
        let message

        const tagsData = await tagController.listAllTags()

        if(tagsData) {
            statusCode = tagsData.status
            message = tagsData.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

module.exports = router