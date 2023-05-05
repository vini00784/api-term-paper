const express = require('express')
const jsonParser = express.json()
const complaintsController = require('../controllers/complaintController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/report-announcement')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementComplaint = await complaintsController.newAnnouncementComplaint(bodyData)

                statusCode = newAnnouncementComplaint.status
                message = newAnnouncementComplaint.message
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
    .route('/report-short-storie')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorieComplaint = await complaintsController.newShortStorieComplaint(bodyData)

                statusCode = newShortStorieComplaint.status
                message = newShortStorieComplaint.message
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
    .route('/report-user')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newUserComplaint = await complaintsController.newUserComplaint(bodyData)

                statusCode = newUserComplaint.status
                message = newUserComplaint.message
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
    .route('/complaint-types')
    .get(async(req, res) => {
        let statusCode
        let message

        const complaintTypes = await complaintsController.listAllComplaintTypes()

        statusCode = complaintTypes.status
        message = complaintTypes.message

        res.status(statusCode).json(message)
    })

module.exports = router