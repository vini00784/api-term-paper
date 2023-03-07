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

exports.listAllGenres = async () => {
    let genresJson = {}

    const genresData = await genreModel.selectAllGenres()

    if(genresData) {
        genresJson.genres = genresData
        return {status: 200, message: genresJson}
    } else
        return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
}