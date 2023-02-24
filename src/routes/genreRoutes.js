const express = require('express')
const genreController = require('../controllers/genreController.js')

const router = express.Router()

router
    .route('/genres')
    .get(genreController.listAllGenres)

module.exports = router