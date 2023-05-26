const express = require('express')
const jsonParser = express.json()
const dashboardController = require('../controllers/dashboardController.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/show-dashboard-infos/announcement-id/:announcementId')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.params.announcementId

        const dashboardInfos = await dashboardController.getAnnouncementsInfos(announcementId)

        statusCode = dashboardInfos.status
        message = dashboardInfos.message

        res.status(statusCode).json(message)
    })

module.exports = router