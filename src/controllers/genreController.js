/*
    Objetivo:     File responsible for handling genre (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// User model
const genreModel = require('../models/DAO/genre.js')

exports.listAllGenres = async (req, res) => {
    let statusCode
    let message

    const genresData = await genreModel.selectAllGenres()

    if(genresData) {
        statusCode = 200
        message = genresData
    } else {
        statusCode = 404
        message = MESSAGE_ERROR.NOT_FOUND_DB
    }

    res.status(statusCode).json(message)
}