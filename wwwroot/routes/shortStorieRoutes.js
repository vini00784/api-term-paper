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

    .get(async(req, res) => {
        let statusCode
        let message
        let id = req.params.shortStorieId

        if(id != '' && id != undefined) {
            const shortStorieData = await shortStorieController.searchShortStorieById(id)

            if(shortStorieData) {
                statusCode = shortStorieData.status
                message = shortStorieData.message
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

router
    .route('/activated-short-stories')
    .get(async(req, res) => {
        let statusCode
        let message

        const activatedShortStories = await shortStorieController.listActivatedShortStories()

        if(activatedShortStories) {
            statusCode = activatedShortStories.status
            message = activatedShortStories.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/desactivated-short-stories/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        if(userId != '' && userId != undefined) {
            const desactivatedShortStories = await shortStorieController.listDesactivatedShortStories(userId)
    
            if(desactivatedShortStories) {
                statusCode = desactivatedShortStories.status
                message = desactivatedShortStories.message
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
    .route('/short-stories/user-id/:userId') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const shortStoriesData = await shortStorieController.listShortStoriesByGenres(userId)

        if(shortStoriesData) {
            statusCode = shortStoriesData.status
            message = shortStoriesData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/short-stories/genre-name/:genreName') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .get(async(req, res) => {
        let statusCode
        let message
        let genreName = req.params.genreName

        const shortStoriesData = await shortStorieController.listShortStoriesByGenresName(genreName)

        if(shortStoriesData) {
            statusCode = shortStoriesData.status
            message = shortStoriesData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/short-stories/storie-title/:shortStorieTitle')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieTitle = req.params.shortStorieTitle

        const shortStoriesData = await shortStorieController.listShortStoriesByTitleName(shortStorieTitle)

        if(shortStoriesData) {
            statusCode = shortStoriesData.status
            message = shortStoriesData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/like-short-storie')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorieLike = await shortStorieController.likeShortStorie(bodyData)

                statusCode = newShortStorieLike.status
                message = newShortStorieLike.message
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
    .route('/count-short-stories-likes/short-storie-id/:shortStorieId')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieId = req.params.shortStorieId

        if(shortStorieId != ''&& shortStorieId != undefined) {
            const shortStorieLikes = await shortStorieController.countShortStorieLikes(shortStorieId)

            if(shortStorieLikes) {
                statusCode = shortStorieLikes.status
                message = shortStorieLikes.message
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
    .route('/dislike-short-storie')
    .delete(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const dislikedShortStorie = await shortStorieController.dislikeShortStorie(bodyData)

                statusCode = dislikedShortStorie.status
                message = dislikedShortStorie.message
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
    .route('/favorite-short-storie')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorieFavorite = await shortStorieController.favoriteShortStorie(bodyData)

                statusCode = newShortStorieFavorite.status
                message = newShortStorieFavorite.message
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