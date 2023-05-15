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

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newRecommendation = await recommendationController.newRecommendation(bodyData)

                statusCode = newRecommendation.status
                message = newRecommendation.message
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
    .route('/recommendation/id/:recommendationId')
    .delete(async(req, res) => {
        let statusCode
        let message
        let recommendationId = req.params.recommendationId

        const deletedRecommendation = await recommendationController.deleteRecommendation(recommendationId)

        statusCode = deletedRecommendation.status
        message = deletedRecommendation.message

        res.status(statusCode).json(message)
    })

module.exports = router