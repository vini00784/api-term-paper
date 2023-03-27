/*
    Objetivo:     File responsible for handling parental ratings (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Announcement model
const parentalRatingController = require('../models/DAO/parentalRating.js')

const listAllParentalRatings = async () => {
    let parentalRatingsJson = {}

    const parentalRatingsData = await parentalRatingController.selectAllParentalRatings()

    if(parentalRatingsData) {
        parentalRatingsJson.parental_ratings = parentalRatingsData
        return {status: 200, message: parentalRatingsJson}
    } else
        return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
}

module.exports = {
    listAllParentalRatings
}