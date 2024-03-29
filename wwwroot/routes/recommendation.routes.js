const express = require('express')
const jsonParser = express.json()
const recommendationController = require('../controllers/recommendationController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { json } = require('express')

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

router
    .route('/recommendation/id/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let recommendationId = req.query.recommendationId
        let userId = req.query.userId

        const recommendationData = await recommendationController.searchRecommendationById(recommendationId, userId)

        statusCode = recommendationData.status
        message = recommendationData.message

        res.status(statusCode).json(message)
    })

router
    .route('/like-recommendation')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newRecommendationLike = await recommendationController.likeRecommendation(bodyData)

                statusCode = newRecommendationLike.status
                message = newRecommendationLike.message
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
    .route('/dislike-recommendation/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let recommendationId = req.query.recommendationId
        let userId = req.query.userId

        const dislikedRecommendation = await recommendationController.dislikeRecommendation(recommendationId, userId)

        statusCode = dislikedRecommendation.status
        message = dislikedRecommendation.message

        res.status(statusCode).json(message)
    })

router
    .route('/favorite-recommendation')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newRecommendationFavorite = await recommendationController.favoriteRecommendation(bodyData)

                statusCode = newRecommendationFavorite.status
                message = newRecommendationFavorite.message
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
    .route('/unfavorite-recommendation/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let recommendationId = req.query.recommendationId
        let userId = req.query.userId

        const unfavoritedRecommendation = await recommendationController.unfavoriteRecommendation(recommendationId, userId)

        statusCode = unfavoritedRecommendation.status
        message = unfavoritedRecommendation.message

        res.status(statusCode).json(message)
    })

router
    .route('/recommendations/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const recommendationsByFollowingUsers = await recommendationController.getRecommendationsByFollowingUsers(userId)

        statusCode = recommendationsByFollowingUsers.status
        message = recommendationsByFollowingUsers.message

        res.status(statusCode).json(message)
    })

module.exports = router