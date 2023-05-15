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

const likeRecommendation = async (recommendationLike) => {
    if(recommendationLike.id_recomendacao == '' || recommendationLike.id_recomendacao == undefined || recommendationLike.id_usuario == '' || recommendationLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newRecommendationLike = await recommendationModel.insertRecommendationLike(recommendationLike)

        if(newRecommendationLike)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const dislikeRecommendation = async (recommendationId, userId) => {
    if(recommendationId == ''|| recommendationId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const dislikedRecommendation = await recommendationModel.deleteRecommendationLike(recommendationId, userId)

        if(dislikedRecommendation)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const favoriteRecommendation = async (recommendationFavorite) => {
    if(recommendationFavorite.id_recomendacao == '' || recommendationFavorite.id_recomendacao == undefined || recommendationFavorite.id_usuario == '' || recommendationFavorite.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newRecommendationFavorite = await recommendationModel.insertRecommendationFavorite(recommendationFavorite)

        if(newRecommendationFavorite)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const unfavoriteRecommendation = async (recommendationId, userId) => {
    if(recommendationId == ''|| recommendationId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const unfavoritedRecommendation = await recommendationModel.deleteRecommendationFavorite(recommendationId, userId)

        if(unfavoritedRecommendation)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const searchRecommendationById = async (recommendationId) => {
    if(recommendationId == '' || recommendationId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const recommendationData = await recommendationModel.selectRecommendationById(recommendationId)

        if(recommendationData) {
            let recommendationJson = {}

            recommendationJson = recommendationData
            return { status: 200, message: recommendationJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

module.exports = {
    newRecommendation,
    deleteRecommendation,
    likeRecommendation,
    dislikeRecommendation,
    favoriteRecommendation,
    unfavoriteRecommendation,
    searchRecommendationById
}