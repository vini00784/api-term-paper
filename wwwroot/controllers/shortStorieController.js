/*
    Objetivo:     File responsible for handling short stories data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Short storie model
const shortStorieModel = require('../models/DAO/shortStorie.js')

// Short storie like
const shortStorieLikeModel = require('../models/DAO/shortStorieLike.js')

// Function to destructure short storie json
const { destructureShortStorieJson } = require('../utils/destructureJson.js')

const newShortStorie = async (shortStorie) => {
    if(shortStorie.titulo == '' || shortStorie.titulo == undefined || shortStorie.sinopse == '' || shortStorie.sinopse == undefined || shortStorie.capa == '' || shortStorie.capa == undefined || shortStorie.historia == '' || shortStorie.historia == undefined || shortStorie.id_usuario == '' || shortStorie.id_usuario == undefined || shortStorie.id_tipo_publicacao == '' || shortStorie.id_tipo_publicacao == undefined || shortStorie.id_classificacao == '' || shortStorie.id_classificacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(shortStorie.titulo.length > 50 || shortStorie.sinopse.length > 2000 || shortStorie.capa.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        shortStorie.data = currentDate
        shortStorie.status = 1

        let shortStorieGenresLength = shortStorie.generos.length
        let genresId = ""

        for(let i = 0; i < shortStorieGenresLength; i++) {
            if(shortStorieGenresLength == 1)
                genresId += `(@id_curta_criado, ${shortStorie.generos[0].id_genero})`

            else if (i == shortStorieGenresLength - 1) 
                genresId += `(@id_curta_criado, ${shortStorie.generos[i].id_genero})`

            else 
                genresId += `(@id_curta_criado, ${shortStorie.generos[i].id_genero}), `
            
        }

        const resultNewShortStorie = await shortStorieModel.insertShortStorie(shortStorie, genresId)

        if(resultNewShortStorie)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const updateShortStorie = async (shortStorie) => {
    if(shortStorie.titulo == '' || shortStorie.titulo == undefined || shortStorie.sinopse == '' || shortStorie.sinopse == undefined || shortStorie.capa == '' || shortStorie.capa == undefined || shortStorie.status == '' || shortStorie.status == undefined || shortStorie.historia == '' || shortStorie.historia == undefined || shortStorie.premium == '' || shortStorie.premium == undefined || shortStorie.id_usuario == '' || shortStorie.id_usuario == undefined || shortStorie.id_tipo_publicacao == '' || shortStorie.id_tipo_publicacao == undefined || shortStorie.id_classificacao == '' || shortStorie.id_classificacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(shortStorie.titulo.length > 50 || shortStorie.sinopse.length > 200 || shortStorie.capa.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        shortStorie.data = currentDate

        let shortStorieGenresLength = shortStorie.generos.length
        let genresId = ""

        for(let i = 0; i < shortStorieGenresLength; i++) {
            if(shortStorieGenresLength == 1)
                genresId += `(${shortStorie.id}, ${shortStorie.generos[0].id_genero})`

            else if (i == shortStorieGenresLength - 1) 
                genresId += `(${shortStorie.id}, ${shortStorie.generos[i].id_genero})`

            else 
                genresId += `(${shortStorie.id}, ${shortStorie.generos[i].id_genero}), `
            
        }

        const updatedShortStorie = await shortStorieModel.updateShortStorie(shortStorie, genresId)

        if(updatedShortStorie)
            return {status: 201, message: MESSAGE_SUCCESS.UPDATE_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const deleteShortStorie = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const deletedShortStorie = await shortStorieModel.deleteShortStorie(shortStorieId)

        if(deletedShortStorie)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const listAllShortStories = async () => {
    const shortStoriesData = await shortStorieModel.selectAllShortStories()
    
    if(shortStoriesData) {
        let shortStoriesJson = {}
        
        const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesData)

        shortStoriesJson = await Promise.all(shortStoriesDataArray)
        return { status: 200, message: shortStoriesJson }
    } else
        return { status: 400, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const desactivateShortStorie = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const desactivatedShortStorie = await shortStorieModel.desactivateShortStorie(shortStorieId)

        if(desactivatedShortStorie)
            return { status: 200, message: MESSAGE_SUCCESS.DESACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const activateShortStorie = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const activatedShortStorie = await shortStorieModel.activateShortStorie(shortStorieId)

        if(activatedShortStorie)
            return { status: 200, message: MESSAGE_SUCCESS.ACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const searchShortStorieById = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const shortStorieData = await shortStorieModel.selectShortStorieById(shortStorieId)

        if(shortStorieData) {
            let shortStorieJson = {}

            const shortStorieDataArray = await destructureShortStorieJson(shortStorieData)

            shortStorieJson = await Promise.all(shortStorieDataArray)
            return { status: 200, message: shortStorieJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listActivatedShortStories = async () => {
    const activatedShortStoriesData = await shortStorieModel.selectActivatedShortStories()
    
    if(activatedShortStoriesData) {
        let shortStoriesJson = {}

        const shortStoriesDataArray = await destructureShortStorieJson(activatedShortStoriesData)
        
        shortStoriesJson = await Promise.all(shortStoriesDataArray)
        return { status: 200, message: shortStoriesJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const listDesactivatedShortStories = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const desactivatedShortStoriesData = await shortStorieModel.selectDesactivatedShortStories(userId)
        
        if(desactivatedShortStoriesData) {
            let shortStoriesJson = {}
    
            const shortStoriesDataArray = await destructureShortStorieJson(desactivatedShortStoriesData)
            
            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByGenres = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const { listGenreByUserId } = require('./genreController.js')

        const userGenres = await listGenreByUserId(userId)

        const userGenresLength = userGenres.message.genres.length

        let genresId = ""

        for(let i = 0; i < userGenresLength; i++) {
            if(userGenresLength == 1)
                genresId += userGenres.message.genres.id_genero[0]
            else if (i == userGenresLength - 1)
                genresId += userGenres.message.genres[i].id_genero
            else
                genresId += `${userGenres.message.genres[i].id_genero}, `
        }

        const shortStoriesByGenre = await shortStorieModel.selectShortStoriesByGenres(genresId)

        if(shortStoriesByGenre) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesByGenre)

            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByGenresName = async (genreName) => {
    if(genreName == '' || genreName == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const shortStoriesByGenreName = await shortStorieModel.selectShortStoriesByGenresName(genreName)

        if(shortStoriesByGenreName) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesByGenreName)
            
            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByTitleName = async (shortStorieTitle) => {
    if(shortStorieTitle == '' || shortStorieTitle == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const shortStoriesByTitleName = await shortStorieModel.selectShortStorieByTitleName(shortStorieTitle)

        if(shortStoriesByTitleName) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesByTitleName)

            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const likeShortStorie = async (shortStorieLike) => {
    if(shortStorieLike.id_historia_curta == '' || shortStorieLike.id_historia_curta == undefined || shortStorieLike.id_usuario == '' || shortStorieLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newShortStorieLike = await shortStorieLikeModel.insertShortStorieLike(shortStorieLike)

        if(newShortStorieLike)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

module.exports = {
    newShortStorie,
    updateShortStorie,
    deleteShortStorie,
    listAllShortStories,
    desactivateShortStorie,
    activateShortStorie,
    searchShortStorieById,
    listActivatedShortStories,
    listDesactivatedShortStories,
    listShortStoriesByGenres,
    listShortStoriesByGenresName,
    listShortStoriesByTitleName,
    likeShortStorie
}