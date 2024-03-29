/*
    Objetivo:     File responsible for handling announcements (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Announcement model
const announcementModel = require('../models/DAO/announcement.js')

// Announcement like model
const announcementLikeModel = require('../models/DAO/announcementLike.js')

// Announcement favorite model
const announcementFavoriteModel = require('../models/DAO/announcementFavorite.js')

// Announcement read model
const announcementReadModel = require('../models/DAO/announcementRead.js')

// Announcement comment model
const announcementCommentModel = require('../models/DAO/announcementComment.js')

// Function to destructure announcement json
const { destructureAnnouncementJson, verifyAnnouncementLikeFavoriteRead, verifyAnnouncementUserCart } = require('../utils/destructureJson.js')

const newAnnouncement = async (announcement) => {
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined || announcement.epub == '' || announcement.epub == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(announcement.titulo.length > 50 || announcement.capa.length > 500 || announcement.sinopse.length > 2000 || announcement.pdf.length > 500 || announcement.epub.length > 500 || announcement.mobi?.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        announcement.data = currentDate
        announcement.status = 1
        announcement.premium = 0

        let announcementGenresLength = announcement.generos.length
        let genresId = ""

        for(let i = 0; i < announcementGenresLength; i++) {
            if(announcementGenresLength == 1)
                genresId += `(@id_anuncio_criado, ${announcement.generos[0].id_genero})`

            else if (i == announcementGenresLength - 1) 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero})`

            else 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero}), `
            
        }

        const resultNewAnnouncement = await announcementModel.insertAnnouncement(announcement, genresId)

        if(resultNewAnnouncement)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const updateAnnouncement = async (announcement) => {
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.epub == '' || announcement.epub == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(announcement.titulo.length > 50 || announcement.capa.length > 500 || announcement.sinopse.length > 2000 || announcement.pdf.length > 500 || announcement.epub.length > 500 || announcement.mobi?.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        announcement.data = currentDate
        
        let announcementGenresLength = announcement.generos.length
        let genresId = ""

        for(let i = 0; i < announcementGenresLength; i++) {
            if(announcementGenresLength == 1)
                genresId += `(${announcement.id}, ${announcement.generos[0].id_genero})`

            else if (i == announcementGenresLength - 1) 
                genresId += `(${announcement.id}, ${announcement.generos[i].id_genero})`

            else 
                genresId += `(${announcement.id}, ${announcement.generos[i].id_genero}), `
            
        }
        
        const updatedAnnouncement = await announcementModel.updateAnnouncement(announcement, genresId)

        if(updatedAnnouncement)
                return {status: 200, message: MESSAGE_SUCCESS.UPDATE_ITEM}
            else
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const deleteAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const deletedAnnouncement = await announcementModel.deleteAnnouncement(announcementId)

        if(deletedAnnouncement)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const listAllAnnouncements = async () => {
    const announcementsData = await announcementModel.selectAllAnnouncements()
    
    if(announcementsData) {
        let announcementsJson = {}

        const announcementsDataArray = await destructureAnnouncementJson(announcementsData)
        
        announcementsJson = await Promise.all(announcementsDataArray)
        return { status: 200, message: announcementsJson }
    }
    else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const desactivateAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const desactivatedAnnouncement = await announcementModel.desactivateAnnouncement(announcementId)

        if(desactivatedAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.DESACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const activateAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const activatedAnnouncement = await announcementModel.activateAnnouncement(announcementId)

        if(activatedAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.ACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const searchAnnouncementById = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementData = await announcementModel.selectAnnouncementById(announcementId)

        if(announcementData) {
            let announcementJson = {}

            const announcementDataArray = await destructureAnnouncementJson(announcementData)

            announcementJson = await Promise.all(announcementDataArray)
            return { status: 200, message: announcementJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listActivatedAnnouncements = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const activatedAnnouncementsData = await announcementModel.selectActivatedAnnouncements(userId)
        
        await verifyAnnouncementLikeFavoriteRead(activatedAnnouncementsData, userId)
        // await verifyAnnouncementUserCart(activatedAnnouncementsData, userId)
        
        if(activatedAnnouncementsData) {
            let announcementsJson = {}
    
            const announcementDataArray = await destructureAnnouncementJson(activatedAnnouncementsData)
            
            announcementsJson = await Promise.all(announcementDataArray)
            return { status: 200, message: announcementsJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }

    }
}

const listDesactivatedAnnouncements = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const desactivatedAnnouncementsData = await announcementModel.selectDesactivatedAnnouncements(userId)
    
        if(desactivatedAnnouncementsData) {
            let announcementsJson = {}
            
            const announcementDataArray = await destructureAnnouncementJson(desactivatedAnnouncementsData)
    
            announcementsJson = await Promise.all(announcementDataArray)
            return { status: 200, message: announcementsJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listAnnouncementsByGenres = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const { listGenreByUserId } = require('./genreController.js')

        const userGenres = await listGenreByUserId(userId)
        let userGenresLength = 0

        if(userGenres.status == 200) {
            userGenresLength = userGenres.message.genres.length

            let genresId = ""

            for(let i = 0; i < userGenresLength; i++) {
                if(userGenresLength == 1)
                    genresId += userGenres.message.genres[0].id_genero
                else if (i == userGenresLength - 1)
                    genresId += userGenres.message.genres[i].id_genero
                else
                    genresId += `${userGenres.message.genres[i].id_genero}, `
            }

            let filteredJson
            const announcementsByGenre = await announcementModel.selectAnnouncementsByGenres(genresId)
            const announcementsByFollowingUsers = await announcementModel.selectAnnouncementsByFollowingUsers(userId)

            if(announcementsByGenre) {
                if(announcementsByFollowingUsers) {
                    let announcementsByGenresAndFollowingUsers = Object.assign([], announcementsByGenre, announcementsByFollowingUsers)
                    
                    filteredJson = announcementsByGenresAndFollowingUsers.filter((element, index, self) => index === self.findIndex((t => (
                        parseInt(t.id) === parseInt(element.id)
                    ))))
                } else
                    filteredJson = announcementsByGenre?.filter((element, index, self) => index === self.findIndex((t => (
                        parseInt(t.id) === parseInt(element.id)
                    ))))
    
                await verifyAnnouncementLikeFavoriteRead(filteredJson, userId)
                
                if(filteredJson) {
                    let announcementsJson = {}
                    
                    const announcementDataArray = await destructureAnnouncementJson(filteredJson)
    
                    announcementsJson = await Promise.all(announcementDataArray)
                    return { status: 200, message: announcementsJson }
                } else
                    return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            } else
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }

    }
}

const likeAnnouncement = async (announcementLike) => {
    if(announcementLike.id_anuncio == '' || announcementLike.id_anuncio == undefined || announcementLike.id_usuario == '' || announcementLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newAnnouncementLike = await announcementLikeModel.insertAnnouncementLike(announcementLike)

        if(newAnnouncementLike)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const countAnnouncementLikes = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementLikes = await announcementLikeModel.countAnnouncementLikes(announcementId)

        if(announcementLikes) {
            let likesJson = {}

            likesJson = announcementLikes

            if(likesJson.id_anuncio == null || likesJson.id_anuncio == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: likesJson }
        }
    }
}

const dislikeAnnouncement = async (announcementLike) => {
    if(announcementLike.id_anuncio == '' || announcementLike.id_anuncio == undefined || announcementLike.id_usuario == '' || announcementLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const dislikeAnnouncement = await announcementLikeModel.deleteAnnouncementLike(announcementLike)

        if(dislikeAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const favoriteAnnouncement = async (announcementFavorite) => {
    if(announcementFavorite.id_anuncio == '' || announcementFavorite.id_anuncio == undefined || announcementFavorite.id_usuario == '' || announcementFavorite.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newAnnouncementFavorite = await announcementFavoriteModel.insertAnnouncementFavorite(announcementFavorite)

        if(newAnnouncementFavorite)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const countAnnouncementFavorites = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementFavorites = await announcementFavoriteModel.countAnnouncementFavorites(announcementId)

        if(announcementFavorites) {
            let favoritesJson = {}

            favoritesJson = announcementFavorites

            if(favoritesJson.id_anuncio == null || favoritesJson.id_anuncio == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: favoritesJson }
        }
    }
}

const unfavoriteAnnouncement = async (announcementFavorite) => {
    if(announcementFavorite.id_anuncio == '' || announcementFavorite.id_anuncio == undefined || announcementFavorite.id_usuario == '' || announcementFavorite.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const unfavoriteAnnouncement = await announcementFavoriteModel.deleteAnnouncementFavorite(announcementFavorite)

        if(unfavoriteAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const markAnnouncementAsRead = async (annoucementRead) => {
    if(annoucementRead.id_anuncio == '' || annoucementRead.id_anuncio == undefined || annoucementRead.id_usuario == '' || annoucementRead.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newAnnouncementRead = await announcementReadModel.insertAnnouncementRead(annoucementRead)

        if(newAnnouncementRead)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const countAnnouncementReads = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementReads = await announcementReadModel.countAnnouncementReads(announcementId)

        if(announcementReads) {
            let readsJson = {}

            readsJson = announcementReads

            if(readsJson.id_anuncio == null || readsJson.id_anuncio == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: readsJson }
        }
    }
}

const unreadAnnouncement = async (announcementRead) => {
    if(announcementRead.id_anuncio == '' || announcementRead.id_anuncio == undefined || announcementRead.id_usuario == '' || announcementRead.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const unreadAnnouncement = await announcementReadModel.deleteAnnouncementRead(announcementRead)

        if(unreadAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const verifyAnnouncementLike = async (announcementID, userID) => {
    if(announcementID == '' || announcementID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedAnnouncementLike = await announcementLikeModel.verifyAnnouncementLike(announcementID, userID)

        if(verifiedAnnouncementLike)
            return true
        else
            return false
    }
}

const verifyAnnouncementFavorite = async (announcementID, userID) => {
    if(announcementID == '' || announcementID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedAnnouncementFavorite = await announcementFavoriteModel.verifyAnnouncementFavorite(announcementID, userID)

        if(verifiedAnnouncementFavorite)
            return true
        else
            return false
    }
}

const verifyAnnouncementRead = async (announcementID, userID) => {
    if(announcementID == '' || announcementID == undefined || userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedAnnouncementRead = await announcementReadModel.verifyAnnouncementRead(announcementID, userID)

        if(verifiedAnnouncementRead)
            return true
        else
            return false
    }
}

const listFavoritedAnnouncements = async (userID) => {
    if(userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const favoritedAnnouncementsData = await announcementFavoriteModel.selectFavoritedAnnouncements(userID)

        await verifyAnnouncementLikeFavoriteRead(favoritedAnnouncementsData, userID)
        // await verifyAnnouncementUserCart(favoritedAnnouncementsData, userID)

        if(favoritedAnnouncementsData) {
            let favoritedAnnouncements = {}

            const announcementDataArray = await destructureAnnouncementJson(favoritedAnnouncementsData)

            favoritedAnnouncements = await Promise.all(announcementDataArray)
            return { status: 200, message: favoritedAnnouncements }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const listReadedAnnouncements = async (userID) => {
    if(userID == '' || userID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const readedAnnouncementsData = await announcementReadModel.selectReadedAnnouncements(userID)

        await verifyAnnouncementLikeFavoriteRead(readedAnnouncementsData, userID)
        // await verifyAnnouncementUserCart(readedAnnouncementsData, userID)

        if(readedAnnouncementsData) {
            let readedAnnouncements = {}

            const announcementDataArray = await destructureAnnouncementJson(readedAnnouncementsData)

            readedAnnouncements = await Promise.all(announcementDataArray)
            return { status: 200, message: readedAnnouncements }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const filterAnnouncementsByGenresPrice = async (genres, minPrice, maxPrice, userId, bestRated, announcementTitle) => {
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
   
    const announcementsByGenresPrice = await announcementModel.selectAnnouncementsByFilters(genresNames, minPrice, maxPrice, bestRated, announcementTitle)

    await verifyAnnouncementLikeFavoriteRead(announcementsByGenresPrice, userId)

    // let filteredJson = announcementsByGenresPrice.filter((element, index, self) => index === self.findIndex((t => (
    //     parseInt(t.id) === parseInt(element.id)
    // ))))

    if(announcementsByGenresPrice) {
        let announcementsJson = {}

        const announcementsDataArray = await destructureAnnouncementJson(announcementsByGenresPrice)

        announcementsJson = await Promise.all(announcementsDataArray)
        return { status: 200, message: announcementsJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const newAnnouncementComment = async (comment) => {
    if(comment.resenha == ''|| comment.resenha == undefined || comment.spoiler == ''|| comment.spoiler == undefined || comment.id_usuario == '' || comment.id_usuario == undefined || comment.id_anuncio == '' || comment.id_anuncio == undefined || comment.avaliacao == '' || comment.avaliacao == undefined || comment.titulo == '' || comment.titulo == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(comment.resenha.length > 2000 || comment.titulo.length > 80)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        if (comment.id_resposta == undefined) comment.id_resposta = null
        
        const currentDate = new Date().toJSON().slice(0, 10)
        comment.data = currentDate
        comment.status = 1

        const resultNewAnnouncementComment = await announcementCommentModel.insertAnnouncementComment(comment)

        if(resultNewAnnouncementComment)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 200, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const deleteAnnouncementComment = async (commentId, announcementId) => {
    if(commentId == '' || commentId == undefined || announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const deletedComment = await announcementCommentModel.deleteAnnouncementComment(commentId, announcementId)

        if(deletedComment)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const listAnnouncementComments = async (announcementId, userId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementCommentsData = await announcementCommentModel.selectAnnouncementComments(announcementId)

        if(announcementCommentsData) {
            let commentsJson = {}
            const { countAnnouncementCommentLikes } = require('../models/DAO/announcementComment.js')

            const commentDataArray = announcementCommentsData.map(async element => {
                const announcementCommentLikeData = await verifyAnnouncementCommentLike(element.id, userId)
                const announcementCommentsLikes = await countAnnouncementCommentLikes(element.id)
                element.id_anuncio = announcementId
                element.curtido = announcementCommentLikeData
                
                if(announcementCommentsLikes)
                    element.curtidas = announcementCommentsLikes
                
                return element
            })
            
            commentsJson = await Promise.all(commentDataArray)
            return { status: 200, message: commentsJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const likeAnnouncementComment = async (commentLike) => {
    if(commentLike.id_comentario == '' || commentLike.id_comentario == undefined || commentLike.id_usuario == '' || commentLike.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const likeComment = await announcementCommentModel.insertAnnouncementCommentLike(commentLike)

        if(likeComment)
            return { status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const dislikeAnnouncementComment = async (commentId, userId) => {
    if(commentId == '' || commentId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const dislikeComment = await announcementCommentModel.deleteAnnouncementCommentLike(commentId, userId)

        if(dislikeComment)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const verifyAnnouncementComment = async (announcementId, userId) => {
    if(announcementId == '' || announcementId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedAnnouncementComment = await announcementCommentModel.verifyAnnouncementComment(announcementId, userId)

        if(verifiedAnnouncementComment)
            return true
        else
            return false
    }
}

const verifyAnnouncementCommentLike = async (commentId, userId) => {
    if(commentId == '' || commentId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedAnnouncementCommentLike = await announcementCommentModel.verifyAnnouncementCommentLike(commentId, userId)

        if(verifiedAnnouncementCommentLike)
            return true
        else
            return false
    }
}

const listAnnouncementsByPurchases = async (userId) => {
    const announcementsByPurchasesData = await announcementModel.selectAnnouncementsByPurchasesCount()

    await verifyAnnouncementLikeFavoriteRead(announcementsByPurchasesData, userId)

    if(announcementsByPurchasesData) {
        let announcementsJson = {}

        const announcementsDataArray = await destructureAnnouncementJson(announcementsByPurchasesData)

        announcementsJson = await Promise.all(announcementsDataArray)
        return { status: 200, message: announcementsJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const listAnnouncementsByLikes = async (userId) => {
    const announcementsByLikesData = await announcementModel.selectAnnouncementsByLikesCount()

    await verifyAnnouncementLikeFavoriteRead(announcementsByLikesData, userId)

    if(announcementsByLikesData) {
        let announcementsJson = {}

        const announcementsDataArray = await destructureAnnouncementJson(announcementsByLikesData)

        announcementsJson = await Promise.all(announcementsDataArray)
        return { status: 200, message: announcementsJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

module.exports = {
    newAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    listAllAnnouncements,
    desactivateAnnouncement,
    activateAnnouncement,
    searchAnnouncementById,
    listActivatedAnnouncements,
    listDesactivatedAnnouncements,
    listAnnouncementsByGenres,
    likeAnnouncement,
    countAnnouncementLikes,
    dislikeAnnouncement,
    favoriteAnnouncement,
    countAnnouncementFavorites,
    unfavoriteAnnouncement,
    markAnnouncementAsRead,
    countAnnouncementReads,
    unreadAnnouncement,
    verifyAnnouncementLike,
    verifyAnnouncementFavorite,
    verifyAnnouncementRead,
    listFavoritedAnnouncements,
    listReadedAnnouncements,
    filterAnnouncementsByGenresPrice,
    newAnnouncementComment,
    deleteAnnouncementComment,
    listAnnouncementComments,
    likeAnnouncementComment,
    dislikeAnnouncementComment,
    verifyAnnouncementComment,
    verifyAnnouncementCommentLike,
    listAnnouncementsByPurchases,
    listAnnouncementsByLikes
}