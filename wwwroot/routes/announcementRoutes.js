const express = require('express')
const jsonParser = express.json()
const announcementController = require('../controllers/announcementController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { verifyAnnouncementLikeUser } = require('../utils/destructureJson.js')

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

router
    .route('/announcement/id/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.query.announcementId
        let userId = req.query.userId

        if(announcementId != '' && announcementId != undefined) {
            const announcementData = await announcementController.searchAnnouncementById(announcementId)
            await verifyAnnouncementLikeUser(announcementData, announcementId, userId)

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
    .route('/activated-announcement/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        if(userId != '' && userId != undefined) {
            const activatedAnnouncements = await announcementController.listActivatedAnnouncements(userId)
    
            if(activatedAnnouncements) {
                statusCode = activatedAnnouncements.status
                message = activatedAnnouncements.message
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
    .route('/desactivated-announcement/user-id/:userId')
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
    .route('/announcements/genre-name/?') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .get(async(req, res) => {
        let statusCode
        let message
        let genreName = req.query.genreName
        let userId = req.query.userId

        const announcementsData = await announcementController.listAnnouncementsByGenresName(genreName, userId)

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
    .route('/announcements/announcement-title/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementTitle = req.query.announcementTitle
        let userId = req.query.userId

        const announcementsData = await announcementController.listAnnouncementsByTitleName(announcementTitle, userId)

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
    .post(jsonParser, async (req, res) => {
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
    .post(jsonParser, async(req, res) => {
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

router
    .route('/favorite-announcement')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementFavorite = await announcementController.favoriteAnnouncement(bodyData)

                statusCode = newAnnouncementFavorite.status
                message = newAnnouncementFavorite.message
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
    .route('/count-announcement-favorites/announcement-id/:announcementId')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.params.announcementId

        if(announcementId != ''&& announcementId != undefined) {
            const announcementFavorites = await announcementController.countAnnouncementFavorites(announcementId)

            if(announcementFavorites) {
                statusCode = announcementFavorites.status
                message = announcementFavorites.message
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
    .route('/unfavorite-announcement')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const unfavoritedAnnouncement = await announcementController.unfavoriteAnnouncement(bodyData)

                statusCode = unfavoritedAnnouncement.status
                message = unfavoritedAnnouncement.message
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
    .route('/mark-announcement-as-read')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementRead = await announcementController.markAnnouncementAsRead(bodyData)

                statusCode = newAnnouncementRead.status
                message = newAnnouncementRead.message
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
    .route('/count-announcement-reads/announcement-id/:announcementId')
    .get(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.params.announcementId

        if(announcementId != ''&& announcementId != undefined) {
            const announcementReads = await announcementController.countAnnouncementReads(announcementId)

            if(announcementReads) {
                statusCode = announcementReads.status
                message = announcementReads.message
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
    .route('/unread-announcement')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const unreadedAnnouncement = await announcementController.unreadAnnouncement(bodyData)

                statusCode = unreadedAnnouncement.status
                message = unreadedAnnouncement.message
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
    .route('/verify-announcement-like/?')
    .get(jsonParser, async(req, res) => {
        let statusCode
        let message
        let announcementID = req.query.announcementID
        let userID = req.query.userID

        if(announcementID != '' || announcementID != undefined || userID != '' || userID != undefined) {
            const verifiedAnnouncementLike = await announcementController.verifyAnnouncementLike(announcementID, userID)
    
            statusCode = verifiedAnnouncementLike.status
            message = verifiedAnnouncementLike.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_FIELDS
        }

        res.status(statusCode).json(message)
    })

module.exports = router