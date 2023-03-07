const express = require('express')
const genreController = require('../controllers/genreController.js')

const router = express.Router()

router
    .route('/genres')
    .get(async (req, res) => {
        let statusCode
        let message
    
        const genresData = await genreController.selectAllGenres()
    
        if(genresData) {
            statusCode = 200
            message = genresData
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    
        res.status(statusCode).json(message)
    })

module.exports = router