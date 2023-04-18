const destructureAnnouncementJson = async (json) => {
    const { selectParentalRatingByAnnouncementId } = require('../models/DAO/parentalRating.js')
    const { selectUserByAnnouncementId, selectPublicationTypeByAnnouncementId } = require ('../models/DAO/announcement.js')
    const { selectGenreByAnnouncementId } = require('../models/DAO/genre.js')
    const { countAnnouncementLikes, verifyAnnouncementLike } = require('../models/DAO/announcementLike.js')
    const { countAnnouncementFavorites } = require('../models/DAO/announcementFavorite.JS')
    const { countAnnouncementReads } = require('../models/DAO/announcementRead.js')

    const announcementDataArray = json.map(async announcementItem => {
        const announcementParentalRatingData = await selectParentalRatingByAnnouncementId(announcementItem.id)
            const announcementUserData = await selectUserByAnnouncementId(announcementItem.id)
            const publicationTypeData = await selectPublicationTypeByAnnouncementId(announcementItem.id)
            const announcementGenresData = await selectGenreByAnnouncementId(announcementItem.id)
            const announcementLikesData = await countAnnouncementLikes(announcementItem.id)
            const announcementFavoritesData = await countAnnouncementFavorites(announcementItem.id)
            const announcementReadsData = await countAnnouncementReads(announcementItem.id)
        
            if(announcementParentalRatingData) {
                announcementItem.classificacao = announcementParentalRatingData

                if(announcementUserData) {
                    announcementItem.usuario = announcementUserData

                    if(publicationTypeData) {
                        announcementItem.tipo = publicationTypeData

                        if(announcementGenresData) {
                            announcementItem.generos = announcementGenresData

                            if(announcementLikesData.quantidade_curtidas > 0)
                                announcementItem.curtidas = announcementLikesData

                            if(announcementFavoritesData.quantidade_favoritos > 0)
                                announcementItem.favoritos = announcementFavoritesData

                            if(announcementReadsData.quantidade_lido > 0)
                                announcementItem.lidos = announcementReadsData
                        }
                    }
                }
            }

            return announcementItem
    })

    return announcementDataArray
}

const destructureShortStorieJson = async (json) => {
    const { selectParentalRatingByShortStorieId } = require('../models/DAO/parentalRating.js')
    const { selectUserByShortStorieId, selectPublicationTypeByShortStorieId } = require('../models/DAO/shortStorie.js')
    const { selectGenreByShortStorieId } = require('../models/DAO/genre.js')
    const { countShortStorieLikes } = require('../models/DAO/shortStorieLike.js')
    const { countShortStorieFavorites } = require('../models/DAO/shortStorieFavorite.js')
    const { countShortStorieReads } = require('../models/DAO/shortStorieRead.js')

    const shortStoriesDataArray = json.map(async shortStorieItem => {
        const shortStorieParentalRatingData = await selectParentalRatingByShortStorieId(shortStorieItem.id)
        const shortStorieUserData = await selectUserByShortStorieId(shortStorieItem.id)
        const publicationTypeData = await selectPublicationTypeByShortStorieId(shortStorieItem.id)
        const shortStorieGenresData = await selectGenreByShortStorieId(shortStorieItem.id)
        const shortStorieLikesData = await countShortStorieLikes(shortStorieItem.id)
        const shortStorieFavoritesData = await countShortStorieFavorites(shortStorieItem.id)
        const shortStorieReadsData = await countShortStorieReads(shortStorieItem.id)

        if(shortStorieParentalRatingData) {
            shortStorieItem.classificacao = shortStorieParentalRatingData

            if(shortStorieUserData) {
                shortStorieItem.usuario = shortStorieUserData

                if(publicationTypeData) {
                    shortStorieItem.tipo = publicationTypeData

                    if(shortStorieGenresData) {
                        shortStorieItem.generos = shortStorieGenresData

                        if(shortStorieLikesData.quantidade_curtidas > 0)
                            shortStorieItem.curtidas = shortStorieLikesData

                        if(shortStorieFavoritesData.quantidade_favoritos > 0)
                            shortStorieItem.favoritos = shortStorieFavoritesData
                        
                        if(shortStorieReadsData.quantidade_lidos > 0)
                            shortStorieItem.lidos = shortStorieReadsData
                    }
                }
            }
        }

        return shortStorieItem
    })

    return shortStoriesDataArray
}

const destructureUserJson = async (json) => {
    const { selectGenreByUserId } = require('../models/DAO/genre.js')
    const { selectTagByUserId } = require('../models/DAO/tag.js')
    const { selectAnnouncementByUserId } = require('../models/DAO/announcement.js')
    const { selectShortStorieByUserId } = require('../models/DAO/shortStorie.js')

    const userDataArray = json.map(async userItem => {
        const userTagArrayData = await selectTagByUserId(userItem.id)
        const userGenreArrayData = await selectGenreByUserId(userItem.id)
        const userAnnouncementArrayData = await selectAnnouncementByUserId(userItem.id)
        const userShortStorieArrayData = await selectShortStorieByUserId(userItem.id)

        if(userTagArrayData) {
            userItem.tags = userTagArrayData

            if(userGenreArrayData) {
                userItem.generos = userGenreArrayData

                if(userAnnouncementArrayData)
                    userItem.anuncios = userAnnouncementArrayData
    
                if(userShortStorieArrayData)
                    userItem.historias_curtas = userShortStorieArrayData
                
            }
        }
        return userItem
    })

    return userDataArray
}

const verifyAnnouncementLikeFavoriteReadById = async (json, announcementId, userId) => {
    const { verifyAnnouncementLike, verifyAnnouncementFavorite, verifyAnnouncementRead } = require('../models/DAO/announcementLike.js')
    const announcementLikeVerify = await verifyAnnouncementLike(announcementId, userId)
    const announcementFavoriteVerify = await verifyAnnouncementFavorite(announcementId, userId)
    const announcementReadVerify = await verifyAnnouncementRead(announcementId, userId)

    json.message.forEach(element => {
        element.curtido = announcementLikeVerify
        element.favorito = announcementFavoriteVerify
        element.lido = announcementReadVerify
    })

    return announcementLikeVerify
}

const verifyAnnouncementLikeFavoriteRead = async (json, userId) => {
    json.forEach(async element => {
        const { verifyAnnouncementLike, verifyAnnouncementFavorite, verifyAnnouncementRead } = require('../controllers/announcementController.js')
        const announcementLikeVerify = await verifyAnnouncementLike(element.id, userId)
        const announcementFavoriteVerify = await verifyAnnouncementFavorite(element.id, userId)
        const announcementReadVerify = await verifyAnnouncementRead(element.id, userId)

        if(announcementLikeVerify)
            element.curtido = announcementLikeVerify.message
        if(announcementFavoriteVerify)
            element.favorito = announcementFavoriteVerify.message
        if(announcementReadVerify)
            element.lido = announcementReadVerify.message
    })
}

module.exports = {
    destructureAnnouncementJson,
    destructureShortStorieJson,
    destructureUserJson,
    verifyAnnouncementLikeFavoriteReadById,
    verifyAnnouncementLikeFavoriteRead
}