const express = require('express')
const jsonParser = express.json()
const parentalRatingController = require('../controllers/parentalRatingController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/parental-ratings')
    .get(async (req, res) => {
        let statusCode
        let message

        const parentalRatingsData = await parentalRatingController.listAllParentalRatings()

        if(parentalRatingsData) {
            statusCode = parentalRatingsData.status
            message = parentalRatingsData.message
        } else {
            statusCode = 404
            statusCode = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

module.exports = router