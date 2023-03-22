const express = require('express')
const jsonParser = express.json()
const announcementController = require('../controllers/announcementController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { Router } = require('express')

const router = express.Router()

router
    .route('/announcement')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncement = await announcementController.newAnnouncement(bodyData)

                statusCode = newAnnouncement.status
                message = newAnnouncement.message
            } else {
                statusCode = 400
                message = MESSAGE_ERROR.EMPTY_BODY
            }
        } else {
            statusCode = 415
            message = MESSAGE_ERROR.INCORRECT_CONTENT_TYPE
        }

        res.status(statusCode).json(message)
    })

router
    .route('/announcement/id/:announcementId')
    .put(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                let id = req.params.announcementId

                if(id != '' && id != undefined) {
                    bodyData.id = id

                    const updatedAnnouncement = await announcementController.updateAnnouncement(bodyData)

                    statusCode = updatedAnnouncement.status
                    message = updatedAnnouncement.message
                } else {
                    statusCode = 400
                    message = MESSAGE_ERROR.REQUIRED_ID
                }
            } else {
                statusCode = 400
                message = MESSAGE_ERROR.EMPTY_BODY
            }
        } else {
            statusCode = 415
            message = MESSAGE_ERROR.INCORRECT_CONTENT_TYPE
        }

        res.status(statusCode).json(message)
    })

    .delete(async(req, res) => {
        let statusCode
        let message

        let id = req.params.announcementId

        if(id != '' && id != undefined) {
            const deletedAnnouncement = await announcementController.deleteAnnouncement(id)

            statusCode = deletedAnnouncement.status
            message = deletedAnnouncement.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

module.exports = router