const express = require('express')
const genreController = require('../controllers/genreController.js')
const { MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/genres')
    .get(async (req, res) => {
        let statusCode
        let message
    
        const genresData = await genreController.listAllGenres()
    
        if(genresData) {
            statusCode = genresData.status
            message = genresData.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    
        res.status(statusCode).json(message)
    })

router
    .route('/genres/id/:userId')
    .get(async (req, res) => {
        let statusCode
        let message
        let id = req.params.userId

        if(id != '' && id != undefined) {
            const genresData = await genreController.listGenreByUserId(id)

            if(genresData) {
                statusCode = genresData.status
                message = genresData.message
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

module.exports = router