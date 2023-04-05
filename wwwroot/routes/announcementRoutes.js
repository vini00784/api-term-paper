const express = require('express')
const jsonParser = express.json()
const announcementController = require('../controllers/announcementController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { Router } = require('express')
const { route } = require('./genreRoutes.js')

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
    .route('/announcements')
    .get(async(req, res) => {
        let statusCode
        let message

        const announcementsData = await announcementController.listAllAnnouncements()

        if(announcementsData) {
            statusCode = announcementsData.status
            message = announcementsData.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
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

    .get(async(req, res) => {
        let statusCode
        let message
        let id = req.params.announcementId

        if(id != '' && id != undefined) {
            const announcementData = await announcementController.searchAnnouncementById(id)

            if(announcementData) {
                statusCode = announcementData.status
                message = announcementData.message
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
    .route('/desactivate-announcement/id/:announcementId')
    .put(async(req, res) => {
        let statusCode
        let message

        let id = req.params.announcementId

        if(id != '' && id != undefined) {
            const desactivatedAnnouncement = await announcementController.desactivateAnnouncement(id)

            statusCode = desactivatedAnnouncement.status
            message = desactivatedAnnouncement.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/activate-announcement/id/:announcementId')
    .put(async(req, res) => {
        let statusCode
        let message

        let id = req.params.announcementId

        if(id != '' && id != undefined) {
            const activatedAnnouncement = await announcementController.activateAnnouncement(id)

            statusCode = activatedAnnouncement.status
            message = activatedAnnouncement.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/activated-announcements')
    .get(async(req, res) => {
        let statusCode
        let message

        const activatedAnnouncements = await announcementController.listActivatedAnnouncements()

        if(activatedAnnouncements) {
            statusCode = activatedAnnouncements.status
            message = activatedAnnouncements.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/desactivated-announcements/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId
        
        if(userId != '' && userId != undefined) {
            const desactivatedAnnouncements = await announcementController.listDesactivatedAnnouncements(userId)
            
            if(desactivatedAnnouncements) {
                statusCode = desactivatedAnnouncements.status
                message = desactivatedAnnouncements.message
            } else {
                statusCode = 404
                message = MESSAGE_ERROR.NOT_FOUND_DB
            }
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_FIELDS
        }

        res.status(statusCode).json(message)
    })

router
    .route('/announcements/user-id/:userId') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const announcementsData = await announcementController.listAnnouncementsByGenres(userId)

        if(announcementsData) {
            statusCode = announcementsData.status
            message = announcementsData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/announcements/genre-name/:genreName') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .get(async(req, res) => {
        let statusCode
        let message
        let genreName = req.params.genreName

        const announcementsData = await announcementController.listAnnouncementsByGenresName(genreName)

        if(announcementsData) {
            statusCode = announcementsData.status
            message = announcementsData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/announcements/announcement-title/:announcementTitle')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementTitle = req.params.announcementTitle

        const announcementsData = await announcementController.listAnnouncementsByTitleName(announcementTitle)

        if(announcementsData) {
            statusCode = announcementsData.status
            message = announcementsData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/like-announcement')
    .put(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementLike = await announcementController.likeAnnouncement(bodyData)

                statusCode = newAnnouncementLike.status
                message = newAnnouncementLike.message
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
    .route('/count-announcement-likes/announcement-id/:announcementId')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.params.announcementId

        if(announcementId != ''&& announcementId != undefined) {
            const announcementLikes = await announcementController.countAnnouncementLikes(announcementId)

            if(announcementLikes) {
                statusCode = announcementLikes.status
                message = announcementLikes.message
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
    .route('/dislike-announcement')
    .delete(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const dislikedAnnouncement = await announcementController.dislikeAnnouncement(bodyData)

                statusCode = dislikedAnnouncement.status
                message = dislikedAnnouncement.message
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

module.exports = router