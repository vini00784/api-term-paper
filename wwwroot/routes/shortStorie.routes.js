const express = require('express')
const jsonParser = express.json()
const shortStorieController = require('../controllers/shortStorieController.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const { verifyShortStorieLikeFavoriteReadById } = require('../utils/destructureJson.js')

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
    .route('/short-storie/id/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieId = req.query.shortStorieId
        let userId = req.query.userId

        if(shortStorieId != '' && shortStorieId != undefined) {
            const shortStorieData = await shortStorieController.searchShortStorieById(shortStorieId)
            await verifyShortStorieLikeFavoriteReadById(shortStorieData, shortStorieId, userId)

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
    .route('/activated-short-storie/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        if(userId != '' && userId != undefined) {
            const activatedShortStories = await shortStorieController.listActivatedShortStories(userId)
    
            if(activatedShortStories) {
                statusCode = activatedShortStories.status
                message = activatedShortStories.message
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
    .route('/desactivated-short-storie/user-id/:userId')
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

        const shortStoriesData = await shortStorieController.listShortStoriesByGenresUser(userId)

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
    .route('/short-stories-by-genres/user-id/:userId') // EndPoint que traz os anúncios de acordo com os gêneros escolhidos pelo usuário
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId
        let headerContentType = req.headers['content-type']
        
        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {

                if(userId != '' && userId != undefined) {
                    const shortStoriesData = await shortStorieController.listShortStoriesByGenres(bodyData, userId)
            
                    if(shortStoriesData) {
                        statusCode = shortStoriesData.status
                        message = shortStoriesData.message
                    } else {
                        statusCode = 400
                        message = MESSAGE_ERROR.NOT_FOUND_DB
                    }
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

router
    .route('/short-stories/genre-name/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let genreName = req.query.genreName
        let userId = req.query.userId

        const shortStoriesData = await shortStorieController.listShortStoriesByGenresName(genreName, userId)

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
    .route('/short-stories/storie-title/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieTitle = req.query.shortStorieTitle
        let userId = req.query.userId

        const shortStoriesData = await shortStorieController.listShortStoriesByTitleName(shortStorieTitle, userId)

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
    .post(jsonParser, async(req, res) => {
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

router
    .route('/count-short-stories-favorites/short-storie-id/:shortStorieId')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieId = req.params.shortStorieId

        if(shortStorieId != ''&& shortStorieId != undefined) {
            const shortStorieFavorites = await shortStorieController.countShortStorieFavorites(shortStorieId)

            if(shortStorieFavorites) {
                statusCode = shortStorieFavorites.status
                message = shortStorieFavorites.message
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
    .route('/unfavorite-short-storie')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const unfavoritedShortStorie = await shortStorieController.unfavoriteShortStorie(bodyData)

                statusCode = unfavoritedShortStorie.status
                message = unfavoritedShortStorie.message
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
    .route('/mark-storie-as-read')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newShortStorieRead = await shortStorieController.markShortStorieAsRead(bodyData)

                statusCode = newShortStorieRead.status
                message = newShortStorieRead.message
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
    .route('/count-short-stories-reads/short-storie-id/:shortStorieId')
    .get(async(req, res) => {
        let statusCode
        let message
        let shortStorieId = req.params.shortStorieId

        if(shortStorieId != ''&& shortStorieId != undefined) {
            const shortStorieReads = await shortStorieController.countShortStorieReads(shortStorieId)

            if(shortStorieReads) {
                statusCode = shortStorieReads.status
                message = shortStorieReads.message
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
    .route('/unread-short-storie')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const unreadedShortStorie = await shortStorieController.unreadShortStorie(bodyData)

                statusCode = unreadedShortStorie.status
                message = unreadedShortStorie.message
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
    .route('/favorited-short-stories/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const favoritedShortStoriesData = await shortStorieController.listFavoritedShortStories(userId)

        if(favoritedShortStoriesData) {
            statusCode = favoritedShortStoriesData.status
            message = favoritedShortStoriesData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/readed-short-stories/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const readedShortStoriesData = await shortStorieController.listReadedShortStories(userId)

        if(readedShortStoriesData) {
            statusCode = readedShortStoriesData.status
            message = readedShortStoriesData.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/short-stories/genres-names/:userId')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']
        let userId= req.params.userId

        if(userId != '' && userId != undefined) {
            if(headerContentType == 'application/json') {
                let bodyData = req.body
    
                if(JSON.stringify(bodyData) != '{}') {
                    const shortStoriesByGenresName = await shortStorieController.listShortStoriesByGenreName(bodyData, userId)
    
                    statusCode = shortStoriesByGenresName.status
                    message = shortStoriesByGenresName.message
                } else {
                    statusCode = 400
                    message = MESSAGE_ERROR.EMPTY_BODY
                }
            } else {
                statusCode = 415
                message = MESSAGE_ERROR.INCORRECT_CONTENT_TYPE
            }
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/filter-short-stories/?')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let userId = req.query.userId
        let bestRated = req.query.bestRated
        let shortStorieTitle = req.query.shortStorieTitle
        
        let bodyData = req.body

        if(bodyData.nome_genero == null) {
            const shortStories = await shortStorieController.filterShortStories(null, shortStorieTitle, bestRated, userId)
        
            statusCode = shortStories.status
            message = shortStories.message
        } else {
            const shortStories = await shortStorieController.filterShortStories(bodyData, shortStorieTitle, bestRated, userId)
            
            statusCode = shortStories.status
            message = shortStories.message
        }

        res.status(statusCode).json(message)
    })

module.exports = router