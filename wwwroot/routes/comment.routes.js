const express = require('express')
const jsonParser = express.json()
const announcementController = require('../controllers/announcementController.js')
const shortStorieController = require('../controllers/shortStorieController.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/announcement-comment')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementComment = await announcementController.newAnnouncementComment(bodyData)

                statusCode = newAnnouncementComment.status
                message = newAnnouncementComment.message
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
    .route('/short-storie-comment')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorieComment = await shortStorieController.newShortStorieComment(bodyData)

                statusCode = newShortStorieComment.status
                message = newShortStorieComment.message
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
    .route('/delete-announcement-comment/id/:commentId')
    .delete(async(req, res) => {
        let statusCode
        let message
        let commentId = req.params.commentId

        const deletedComment = await announcementController.deleteAnnouncementComment(commentId)

        statusCode = deletedComment.status
        message = deletedComment.message

        res.status(statusCode).json(message)
    })

router
    .route('/delete-short-storie-comment/id/:commentId')
    .delete(async(req, res) => {
        let statusCode
        let message
        let commentId = req.params.commentId

        const deletedComment = await shortStorieController.deleteShortStorieComment(commentId)

        statusCode = deletedComment.status
        message = deletedComment.message

        res.status(statusCode).json(message)
    })

router
    .route('/announcement-comments/id/:announcementId')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.params.announcementId

        const announcementComments = await announcementController.listAnnouncementComments(announcementId)

        statusCode = announcementComments.status
        message = announcementComments.message

        res.status(statusCode).json(message)
    })

router
    .route('/short-storie-comments/id/:shortStorieId')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieId = req.params.shortStorieId

        const shortStorieComments = await shortStorieController.listShortStorieComments(shortStorieId)

        statusCode = shortStorieComments.status
        message = shortStorieComments.message

        res.status(statusCode).json(message)
    })

router
    .route('/like-announcement-comment')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const likeAnnouncementComment = await announcementController.likeAnnouncementComment(bodyData)

                statusCode = likeAnnouncementComment.status
                message = likeAnnouncementComment.message
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
    .route('/dislike-announcement-comment/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let commentId = req.query.commentId
        let userId = req.query.userId

        const dislikeAnnouncementComment = await announcementController.dislikeAnnouncementComment(commentId, userId)

        statusCode = dislikeAnnouncementComment.status
        message = dislikeAnnouncementComment.message

        res.status(statusCode).json(message)
    })

router
    .route('/like-short-storie-comment')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const likeShortStorieComment = await shortStorieController.likeShortStorieComment(bodyData)

                statusCode = likeShortStorieComment.status
                message = likeShortStorieComment.message
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
    .route('/dislike-short-storie-comment/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let commentId = req.query.commentId
        let userId = req.query.userId

        const dislikeAnnouncementComment = await shortStorieController.dislikeShortStorieComment(commentId, userId)

        statusCode = dislikeAnnouncementComment.status
        message = dislikeAnnouncementComment.message

        res.status(statusCode).json(message)
    })

module.exports = router