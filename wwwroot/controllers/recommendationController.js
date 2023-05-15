/*
    Objetivo:     File responsible for handling announcements (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Recommendation model
const recommendationModel = require('../models/DAO/recommendation.js')

const newRecommendation = async (recommendation) => {
    if(recommendation.conteudo == '' || recommendation.conteudo == undefined || recommendation.id_usuario == '' || recommendation.id_usuario == undefined || recommendation.id_anuncio == '' || recommendation.id_anuncio == undefined || recommendation.spoiler == '' || recommendation.spoiler == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(recommendation.conteudo.length > 2000)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        recommendation.data_publicado = currentDate

        const resultNewRecommendation = await recommendationModel.insertRecommendation(recommendation)

        if(resultNewRecommendation)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const deleteRecommendation = async (recommendationId) => {
    if(recommendationId == '' || recommendationId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const deletedRecommendation = await recommendationModel.deleteRecommendation(recommendationId)

        if(deletedRecommendation)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

module.exports = {
    newRecommendation,
    deleteRecommendation
}