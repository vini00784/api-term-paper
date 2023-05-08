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

// Short storie like model
const shortStorieLikeModel = require('../models/DAO/shortStorieLike.js')

// Short storie favorite model
const shortStorieFavoriteModel = require('../models/DAO/shortStorieFavorite.js')

// Short storie read model
const shortStorieReadModel = require('../models/DAO/shortStorieRead.js')

// Short storie comment model
const shortStorieCommentModel = require('../models/DAO/shortStorieComment.js')

// Function to destructure short storie json
const { destructureShortStorieJson, verifyShortStorieLikeFavoriteRead } = require('../utils/destructureJson.js')

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
    if(shortStorie.titulo == '' || shortStorie.titulo == undefined || shortStorie.sinopse == '' || shortStorie.sinopse == undefined || shortStorie.capa == '' || shortStorie.capa == undefined || shortStorie.historia == '' || shortStorie.historia == undefined || shortStorie.id_usuario == '' || shortStorie.id_usuario == undefined || shortStorie.id_tipo_publicacao == '' || shortStorie.id_tipo_publicacao == undefined || shortStorie.id_classificacao == '' || shortStorie.id_classificacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(shortStorie.titulo.length > 50 || shortStorie.sinopse.length > 200 || shortStorie.capa.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        shortStorie.data = currentDate
        shortStorie.premium = 0

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

const listActivatedShortStories = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const activatedShortStoriesData = await shortStorieModel.selectActivatedShortStories(userId)
        
        if(activatedShortStoriesData) {
            let shortStoriesJson = {}
    
            const shortStoriesDataArray = await destructureShortStorieJson(activatedShortStoriesData)
            
            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
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

const listShortStoriesByGenresUser = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const { listGenreByUserId } = require('./genreController.js')

        const userGenres = await listGenreByUserId(userId)

        const userGenresLength = userGenres.message.genres.length

        let genresId = ""

        for(let i = 0; i < userGenresLength; i++) {
            if(userGenresLength == 1)
                genresId += userGenres.message.genres[0].id_genero
            else if (i == userGenresLength - 1)
                genresId += userGenres.message.genres[i].id_genero
            else
                genresId += `${userGenres.message.genres[i].id_genero}, `
        }

        const shortStoriesByGenre = await shortStorieModel.selectShortStoriesByGenresUser(genresId)

        let filteredJson = shortStoriesByGenre.filter((element, index, self) => index === self.findIndex((t => (
            parseInt(t.id) === parseInt(element.id)
        ))))

        await verifyShortStorieLikeFavoriteRead(shortStoriesByGenre, userId)

        if(filteredJson) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(filteredJson)

            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByGenres = async (genres, userId) => {
    if(genres == '' || genres == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        let genresNamesLength = genres?.nome_genero?.length
        let genresNames = ""
       
        for(let i = 0; i < genresNamesLength; i++) {
            if(genresNamesLength == 1) {
                genresNames += `'${genres.nome_genero[0].nome}'`
            }
            else if(i == genresNamesLength - 1) {
                genresNames += `'${genres.nome_genero[i].nome}'`
            }
            else
                genresNames += `'${genres.nome_genero[i].nome}', `
        }

        const shortStoriesByGenresID = await shortStorieModel.selectShortStoriesByGenres(genresNames)

        await verifyShortStorieLikeFavoriteRead(shortStoriesByGenresID, userId)

        if(shortStoriesByGenresID) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesByGenresID)
            
            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByGenresName = async (genreName, userId) => {
    if(genreName == '' || genreName == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const shortStoriesByGenreName = await shortStorieModel.selectShortStoriesByGenresName(genreName)

        await verifyShortStorieLikeFavoriteRead(shortStoriesByGenreName, userId)

        if(shortStoriesByGenreName) {
            let shortStoriesJson = {}

            const shortStoriesDataArray = await destructureShortStorieJson(shortStoriesByGenreName)
            
            shortStoriesJson = await Promise.all(shortStoriesDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByTitleName = async (shortStorieTitle, userId) => {
    if(shortStorieTitle == '' || shortStorieTitle == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const shortStoriesByTitleName = await shortStorieModel.selectShortStorieByTitleName(shortStorieTitle)

        await verifyShortStorieLikeFavoriteRead(shortStoriesByTitleName, userId)

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

const countShortStorieLikes = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const shortStorieLikes = await shortStorieLikeModel.countShortStorieLikes(shortStorieId)

        if(shortStorieLikes) {
            let likesJson = {}
            
            likesJson = shortStorieLikes

            if(likesJson.id_historia_curta == null || likesJson.id_historia_curta == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: likesJson }
        }
    }
}

const dislikeShortStorie = async (shortStorieLike) => {
    if(shortStorieLike.id_historia_curta == '' || shortStorieLike.id_historia_curta == undefined || shortStorieLike.id_usuario == '' || shortStorieLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const dislikeShortStorie = await shortStorieLikeModel.deleteShortStorieLike(shortStorieLike)

        if(dislikeShortStorie)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const favoriteShortStorie = async (shortStorieFavorite) => {
    if(shortStorieFavorite.id_historia_curta == '' || shortStorieFavorite.id_historia_curta == undefined || shortStorieFavorite.id_usuario == '' || shortStorieFavorite.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newShortStorieFavorite = await shortStorieFavoriteModel.insertShortStorieFavorite(shortStorieFavorite)

        if(newShortStorieFavorite)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const countShortStorieFavorites = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const shortStorieFavorites = await shortStorieFavoriteModel.countShortStorieFavorites(shortStorieId)

        if(shortStorieFavorites) {
            let favoritesJson = {}
            
            favoritesJson = shortStorieFavorites

            if(favoritesJson.id_historia_curta == null || favoritesJson.id_historia_curta == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: favoritesJson }
        }
    }
}

const unfavoriteShortStorie = async (shortStorieFavorite) => {
    if(shortStorieFavorite.id_historia_curta == '' || shortStorieFavorite.id_historia_curta == undefined || shortStorieFavorite.id_usuario == '' || shortStorieFavorite.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const unfavoriteShortStorie = await shortStorieFavoriteModel.deleteShortStorieFavorite(shortStorieFavorite)

        if(unfavoriteShortStorie)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const markShortStorieAsRead = async (shortStorieRead) => {
    if(shortStorieRead.id_historia_curta == '' || shortStorieRead.id_historia_curta == undefined || shortStorieRead.id_usuario == '' || shortStorieRead.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newShortStorieRead = await shortStorieReadModel.insertShortStorieRead(shortStorieRead)

        if(newShortStorieRead)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const countShortStorieReads = async (shortStorieId) => {
    if(shortStorieId == '' || shortStorieId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const shortStorieReads = await shortStorieReadModel.countShortStorieReads(shortStorieId)

        if(shortStorieReads) {
            let readsJson = {}
            
            readsJson = shortStorieReads

            if(readsJson.id_historia_curta == null || readsJson.id_historia_curta == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: readsJson }
        }
    }
}

const unreadShortStorie = async (shortStorieRead) => {
    if(shortStorieRead.id_historia_curta == '' || shortStorieRead.id_historia_curta == undefined || shortStorieRead.id_usuario == '' || shortStorieRead.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const unreadShortStorie = await shortStorieReadModel.deleteShortStorieRead(shortStorieRead)

        if(unreadShortStorie)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const verifyShortStorieLike = async (shortStorieID, userID) => {
    if(shortStorieID == '' || shortStorieID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedShortStorieLike = await shortStorieLikeModel.verifyShortStorieLike(shortStorieID, userID)

        if(verifiedShortStorieLike)
            return true
        else
            return false
    }
}

const verifyShortStorieFavorite = async (shortStorieID, userID) => {
    if(shortStorieID == '' || shortStorieID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedShortStorieFavorite = await shortStorieFavoriteModel.verifyShortStorieFavorite(shortStorieID, userID)

        if(verifiedShortStorieFavorite)
            return true
        else
            return false
    }
}

const verifyShortStorieRead = async (shortStorieID, userID) => {
    if(shortStorieID == '' || shortStorieID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedShortStorieRead = await shortStorieReadModel.verifyShortStorieRead(shortStorieID, userID)

        if(verifiedShortStorieRead)
            return true
        else
            return false
    }
}

const listFavoritedShortStories = async (userID) => {
    if(userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const favoritedShortStoriesData = await shortStorieFavoriteModel.selectFavoritedShortStories(userID)

        await verifyShortStorieLikeFavoriteRead(favoritedShortStoriesData, userID)

        if(favoritedShortStoriesData) {
            let favoritedShortStories = {}

            const shortStorieDataArray = await destructureShortStorieJson(favoritedShortStoriesData)

            favoritedShortStories = await Promise.all(shortStorieDataArray)
            return { status: 200, message: favoritedShortStories }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listReadedShortStories = async (userID) => {
    if(userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const readedShortStoriesData = await shortStorieReadModel.selectReadedShortStories(userID)

        await verifyShortStorieLikeFavoriteRead(readedShortStoriesData, userID)

        if(readedShortStoriesData) {
            let readedShortStories = {}

            const shortStorieDataArray = await destructureShortStorieJson(readedShortStoriesData)

            readedShortStories = await Promise.all(shortStorieDataArray)
            return { status: 200, message: readedShortStories }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listShortStoriesByGenreName = async (genres, userId) => {
    if(genres) {
        let genresNamesLength = genres.nome_genero.length
        let genresNames = ""
   
        for(let i = 0; i < genresNamesLength; i++) {
            if(genresNamesLength == 1) {
                genresNames += `'${genres.nome_genero[0].nome}'`
            }
            else if(i == genresNamesLength - 1) {
                genresNames += `'${genres.nome_genero[i].nome}'`
            }
            else
                genresNames += `'${genres.nome_genero[i].nome}', `
        }
   
        const shortStoriesByGenresName = await shortStorieModel.selectShortStorieByGenreName(genresNames)

        let filteredJson = shortStoriesByGenresName.filter((element, index, self) => index === self.findIndex((t => (
            parseInt(t.id) === parseInt(element.id)
        ))))

        await verifyShortStorieLikeFavoriteRead(shortStoriesByGenresName, userId)
   
        if(filteredJson) {
            let shortStoriesJson = {}
   
            const shortStorieDataArray = await destructureShortStorieJson(filteredJson)
   
            shortStoriesJson = await Promise.all(shortStorieDataArray)
            return { status: 200, message: shortStoriesJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    } else
        return { status: 400, message: MESSAGE_ERROR.EMPTY_BODY }
}

const newShortStorieComment = async (comment) => {
    if(comment.resenha == ''|| comment.resenha == undefined || comment.spoiler == ''|| comment.spoiler == undefined || comment.titulo == ''|| comment.titulo == undefined || comment.id_usuario == '' || comment.id_usuario == undefined || comment.id_historia_curta == '' || comment.id_historia_curta == undefined || comment.avaliacao == '' || comment.avaliacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(comment.resenha.length > 2000)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        comment.data = currentDate
        comment.status = 1

        const resultNewShortStorieComment = await shortStorieCommentModel.insertShortStorieComment(comment)

        if(resultNewShortStorieComment)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 200, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const deleteShortStorieComment = async (commentId) => {
    if(commentId == '' || commentId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const deletedComment = await shortStorieCommentModel.deleteShortStorieComment(commentId)

        if(deletedComment)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
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
    listShortStoriesByGenresUser,
    listShortStoriesByGenres,
    listShortStoriesByGenresName,
    listShortStoriesByTitleName,
    likeShortStorie,
    countShortStorieLikes,
    dislikeShortStorie,
    favoriteShortStorie,
    countShortStorieFavorites,
    unfavoriteShortStorie,
    markShortStorieAsRead,
    countShortStorieReads,
    unreadShortStorie,
    verifyShortStorieLike,
    verifyShortStorieFavorite,
    verifyShortStorieRead,
    listFavoritedShortStories,
    listReadedShortStories,
    listShortStoriesByGenreName,
    newShortStorieComment,
    deleteShortStorieComment
}