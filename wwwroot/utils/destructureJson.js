const destructureAnnouncementJson = async (json) => {
    const { selectParentalRatingByAnnouncementId } = require('../models/DAO/parentalRating.js')
    const { selectUserByAnnouncementId, selectPublicationTypeByAnnouncementId } = require ('../models/DAO/announcement.js')
    const { selectGenreByAnnouncementId } = require('../models/DAO/genre.js')
    const { countAnnouncementLikes, verifyAnnouncementLike } = require('../models/DAO/announcementLike.js')
    const { countAnnouncementFavorites } = require('../models/DAO/announcementFavorite.js')
    const { countAnnouncementReads } = require('../models/DAO/announcementRead.js')
    const { countAnnouncementPurchases } = require('../models/DAO/buy.js')
    const { countAnnouncementComments } = require('../models/DAO/announcementComment.js')

    const announcementDataArray = json?.map(async announcementItem => {
        const announcementParentalRatingData = await selectParentalRatingByAnnouncementId(announcementItem.id)
            const announcementUserData = await selectUserByAnnouncementId(announcementItem.id)
            const publicationTypeData = await selectPublicationTypeByAnnouncementId(announcementItem.id)
            const announcementGenresData = await selectGenreByAnnouncementId(announcementItem.id)
            const announcementLikesData = await countAnnouncementLikes(announcementItem.id)
            const announcementFavoritesData = await countAnnouncementFavorites(announcementItem.id)
            const announcementReadsData = await countAnnouncementReads(announcementItem.id)
            const announcementPurchasesData = await countAnnouncementPurchases(announcementItem.id)
            const announcementCommentsData = await countAnnouncementComments(announcementItem.id)
        
            if(announcementParentalRatingData) {
                announcementItem.classificacao = announcementParentalRatingData

                if(announcementUserData) {
                    announcementItem.usuario = announcementUserData

                    if(publicationTypeData) {
                        announcementItem.tipo = publicationTypeData

                        if(announcementGenresData) {
                            announcementItem.generos = announcementGenresData

                            if(announcementLikesData.quantidade_curtidas > 0 || announcementLikesData.quantidade_curtidas == undefined)
                                announcementItem.curtidas = announcementLikesData

                            if(announcementFavoritesData.quantidade_favoritos > 0 || announcementFavoritesData.quantidade_favoritos == undefined)
                                announcementItem.favoritos = announcementFavoritesData

                            if(announcementReadsData.quantidade_lido > 0 || announcementReadsData.quantidade_lido == undefined)
                                announcementItem.lidos = announcementReadsData

                            if(announcementPurchasesData.quantidade_compras > 0 || announcementPurchasesData.quantidade_compras == undefined)
                                announcementItem.compras = announcementPurchasesData

                            if(announcementCommentsData.quantidade_comentarios > 0 || announcementPurchasesData.quantidade_comentarios == undefined)
                                announcementItem.comentarios = announcementCommentsData
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
    const { countShortStorieComments } = require('../models/DAO/shortStorieComment.js')

    const shortStoriesDataArray = json?.map(async shortStorieItem => {
        const shortStorieParentalRatingData = await selectParentalRatingByShortStorieId(shortStorieItem.id)
        const shortStorieUserData = await selectUserByShortStorieId(shortStorieItem.id)
        const publicationTypeData = await selectPublicationTypeByShortStorieId(shortStorieItem.id)
        const shortStorieGenresData = await selectGenreByShortStorieId(shortStorieItem.id)
        const shortStorieLikesData = await countShortStorieLikes(shortStorieItem.id)
        const shortStorieFavoritesData = await countShortStorieFavorites(shortStorieItem.id)
        const shortStorieReadsData = await countShortStorieReads(shortStorieItem.id)
        const shortStorieCommentsData = await countShortStorieComments(shortStorieItem.id)

        if(shortStorieParentalRatingData) {
            shortStorieItem.classificacao = shortStorieParentalRatingData

            if(shortStorieUserData) {
                shortStorieItem.usuario = shortStorieUserData

                if(publicationTypeData) {
                    shortStorieItem.tipo = publicationTypeData

                    if(shortStorieGenresData) {
                        shortStorieItem.generos = shortStorieGenresData

                        if(shortStorieLikesData)
                            shortStorieItem.curtidas = shortStorieLikesData

                        if(shortStorieFavoritesData)
                            shortStorieItem.favoritos = shortStorieFavoritesData
                        
                        if(shortStorieReadsData)
                            shortStorieItem.lidos = shortStorieReadsData

                        if(shortStorieCommentsData)
                            shortStorieItem.comentarios = shortStorieCommentsData
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
    const { selectAnnouncementAtiveByUserId } = require('../models/DAO/announcement.js')
    const { selectAnnouncementDeactivateByUserId } = require('../models/DAO/announcement.js')
    const { selectShortStoriesActiveByUserId } = require('../models/DAO/shortStorie.js')
    const { selectShortStoriesDeactiveByUserId } = require('../models/DAO/shortStorie.js')
    const { countUserFollowers, countUserFollowing } = require('../models/DAO/followers.js')
    const { countUserWorks } = require('../models/DAO/user.js')

    const userDataArray = json?.map(async userItem => {
        const userTagArrayData = await selectTagByUserId(userItem.id)
        const userGenreArrayData = await selectGenreByUserId(userItem.id)
        const userAnnouncementAtiveArrayData = await selectAnnouncementAtiveByUserId(userItem.id)
        const userAnnouncementDeactivateArrayData = await selectAnnouncementDeactivateByUserId(userItem.id)
        const userShortStorieActiveArrayData = await selectShortStoriesActiveByUserId(userItem.id)
        const userShortStorieDeactiveArrayData = await selectShortStoriesDeactiveByUserId(userItem.id)
        const userFollowersData = await countUserFollowers(userItem.id)
        const userFollowingData = await countUserFollowing(userItem.id)
        const userWorksData = await countUserWorks(userItem.id)

        if(userTagArrayData) {
            userItem.tags = userTagArrayData

            if(userGenreArrayData) {
                userItem.generos = userGenreArrayData

                if(userAnnouncementAtiveArrayData)
                    userItem.anuncios_ativos = userAnnouncementAtiveArrayData

                if(userAnnouncementDeactivateArrayData)
                    userItem.anuncios_desativados = userAnnouncementDeactivateArrayData
        
                if(userShortStorieActiveArrayData)
                    userItem.historias_curtas_ativas = userShortStorieActiveArrayData

                if(userShortStorieDeactiveArrayData)
                    userItem.historias_curtas_desativadas = userShortStorieDeactiveArrayData

                if(userFollowersData)
                    userItem.seguidores = userFollowersData

                if(userFollowingData)
                    userItem.qtde_seguindo = userFollowingData

                if(userWorksData)
                    userItem.obras = userWorksData
            }
        }
        return userItem
    })

    return userDataArray
}

const verifyUserFollow = async (json, userId) => {
    const { verifyUserFollow } = require('../models/DAO/followers.js')

    if (json) {
        json?.forEach(async element => {
            const userFollowVerify = await verifyUserFollow(userId, element.id)
            element.seguindo = userFollowVerify
        })
    }
}

const verifyAnnouncementLikeFavoriteReadById = async (json, announcementId, userId) => {
    const { verifyAnnouncementLike, verifyAnnouncementFavorite, verifyAnnouncementRead, verifyAnnouncementComment } = require('../controllers/announcementController.js')
    const { verifyUserBuy, verifyUserCart } = require('../controllers/buyController.js')
    const announcementLikeVerify = await verifyAnnouncementLike(announcementId, userId)
    const announcementFavoriteVerify = await verifyAnnouncementFavorite(announcementId, userId)
    const announcementReadVerify = await verifyAnnouncementRead(announcementId, userId)
    const announcementBuyVerify = await verifyUserBuy(announcementId, userId)
    const announcementCartVerify = await verifyUserCart(announcementId, userId)
    const announcementCommentVerify = await verifyAnnouncementComment(announcementId, userId)

    if(json) {
        json?.message?.forEach(element => {
            element.curtido = announcementLikeVerify
            element.favorito = announcementFavoriteVerify
            element.lido = announcementReadVerify
            element.comprado = announcementBuyVerify
            element.carrinho = announcementCartVerify
            element.comentado = announcementCommentVerify
        })
    }
}

const verifyAnnouncementLikeFavoriteRead = async (json, userId) => {
    const { verifyAnnouncementLike, verifyAnnouncementFavorite, verifyAnnouncementRead } = require('../controllers/announcementController.js')
    const { verifyUserBuy, verifyUserCart } = require('../controllers/buyController.js')

    if(json) {
        json?.forEach(async element => {
            const announcementLikeVerify = await verifyAnnouncementLike(element.id, userId)
            const announcementFavoriteVerify = await verifyAnnouncementFavorite(element.id, userId)
            const announcementReadVerify = await verifyAnnouncementRead(element.id, userId)
            const announcementBuyVerify = await verifyUserBuy(element.id, userId)
            const announcementCartVerify = await verifyUserCart(element.id, userId)
    
            element.curtido = announcementLikeVerify
            element.favorito = announcementFavoriteVerify
            element.lido = announcementReadVerify
            element.comprado = announcementBuyVerify
            element.carrinho = announcementCartVerify
        })
    }

}

const verifyShortStorieLikeFavoriteReadById = async(json, shortStorieId, userId) => {
    const { verifyShortStorieLike, verifyShortStorieFavorite, verifyShortStorieRead, verifyShortStorieComment } = require('../controllers/shortStorieController.js')
    const shortStorieLikeVerify = await verifyShortStorieLike(shortStorieId, userId)
    const shortStorieFavoriteVerify = await verifyShortStorieFavorite(shortStorieId, userId)
    const shortStorieReadVerify = await verifyShortStorieRead(shortStorieId, userId)
    const shortStorieCommentVerify = await verifyShortStorieComment(shortStorieId, userId)

    if(json) {
        json?.message?.forEach(element => {
            element.curtido = shortStorieLikeVerify
            element.favorito = shortStorieFavoriteVerify
            element.lido = shortStorieReadVerify
            element.comentado = shortStorieCommentVerify
        })
    }
}

const verifyShortStorieLikeFavoriteRead = async (json, userId) => {
    const { verifyShortStorieLike, verifyShortStorieFavorite, verifyShortStorieRead } = require('../controllers/shortStorieController.js')

    if(json) {
        json?.forEach(async element => {
            const shortStorieLikeVerify = await verifyShortStorieLike(element.id, userId)
            const shortStorieFavoriteVerify = await verifyShortStorieFavorite(element.id, userId)
            const shortStorieReadVerify = await verifyShortStorieRead(element.id, userId)

            element.curtido = shortStorieLikeVerify
            element.favorito = shortStorieFavoriteVerify
            element.lido = shortStorieReadVerify
        })
    }
}

module.exports = {
    destructureAnnouncementJson,
    destructureShortStorieJson,
    destructureUserJson,
    verifyUserFollow,
    verifyAnnouncementLikeFavoriteReadById,
    verifyAnnouncementLikeFavoriteRead,
    verifyShortStorieLikeFavoriteReadById,
    verifyShortStorieLikeFavoriteRead
    // verifyAnnouncementUserCartById,
    // verifyAnnouncementUserCart
}