const express = require('express')
const jsonParser = express.json()
const shortStorieController = require('../controllers/shortStorieController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { json } = require('express')

const router = express.Router()

router
    .route('/short-storie')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorie = await shortStorieController.newShortStorie(bodyData)

                statusCode = newShortStorie.status
                message = newShortStorie.message
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
    .route('/short-stories')
    .get(async (req, res) => {
        let statusCode
        let message

        const shortStoriesData = await shortStorieController.listAllShortStories()

        if(shortStoriesData) {
            statusCode = shortStoriesData.status
            message = shortStoriesData.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/short-storie/id/:shortStorieId')
    .put(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                let id = req.params.shortStorieId

                if(id != '' && id != undefined) {
                    bodyData.id = id

                    const updatedShortStorie = await shortStorieController.updateShortStorie(bodyData)

                    statusCode = updatedShortStorie.status
                    message = updatedShortStorie.message
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

    .delete(async (req, res) => {
        let statusCode
        let message

        let id = req.params.shortStorieId

        if(id != '' && id != undefined) {
            const deletedShortStorie = await shortStorieController.deleteShortStorie(id)

            statusCode = deletedShortStorie.status
            message = deletedShortStorie.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/desactivate-short-storie/id/:shortStorieId')
    .put(async(req, res) => {
        let statusCode
        let message

        let id = req.params.shortStorieId

        if(id != '' && id != undefined) {
            const desactivatedShortStorie = await shortStorieController.desactivateShortStorie(id)

            statusCode = desactivatedShortStorie.status
            message = desactivatedShortStorie.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/activate-short-storie/id/:shortStorieId')
    .put(async(req, res) => {
        let statusCode
        let message

        let id = req.params.shortStorieId

        if(id != '' && id != undefined) {
            const activatedShortStorie = await shortStorieController.activateShortStorie(id)

            statusCode = activatedShortStorie.status
            message = activatedShortStorie.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

module.exports = router