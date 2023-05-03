const express = require('express')
const jsonParser = express.json()
const followerController = require('../controllers/followerController.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/follow-user')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const followUser = await followerController.followUser(bodyData)

                statusCode = followUser.status
                message = followUser.message
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
    .route('/unfollow-user/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let followerId = req.query.followerId
        let followedId = req.query.followedId

        const unfollowUser = await followerController.unfollowUser(followerId, followedId)

        statusCode = unfollowUser.status
        message = unfollowUser.message

        res.status(statusCode).json(message)
    })

router
    .route('/followers/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const userFollowers = await followerController.listUserFollowers(userId)

        statusCode = userFollowers.status
        message = userFollowers.message

        res.status(statusCode).json(message)
    })

module.exports = router