const destructureAnnouncementJson = async (json) => {
    const { selectParentalRatingByAnnouncementId } = require('../models/DAO/parentalRating.js')
    const { selectUserByAnnouncementId, selectPublicationTypeByAnnouncementId } = require ('../models/DAO/announcement.js')
    const { selectGenreByAnnouncementId } = require('../models/DAO/genre.js')

    const announcementDataArray = json.map(async announcementItem => {
        const announcementParentalRatingData = await selectParentalRatingByAnnouncementId(announcementItem.id)
            const announcementUserData = await selectUserByAnnouncementId(announcementItem.id)
            const publicationTypeData = await selectPublicationTypeByAnnouncementId(announcementItem.id)
            const announcementGenresData = await selectGenreByAnnouncementId(announcementItem.id)
        
            if(announcementParentalRatingData) {
                announcementItem.classificacao = announcementParentalRatingData

                if(announcementUserData) {
                    announcementItem.usuario = announcementUserData

                    if(publicationTypeData) {
                        announcementItem.tipo = publicationTypeData

                        if(announcementGenresData)
                            announcementItem.generos = announcementGenresData
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

    const shortStoriesDataArray = json.map(async shortStorieItem => {
        const shortStorieParentalRatingData = await selectParentalRatingByShortStorieId(shortStorieItem.id)
        const shortStorieUserData = await selectUserByShortStorieId(shortStorieItem.id)
        const publicationTypeData = await selectPublicationTypeByShortStorieId(shortStorieItem.id)
        const shortStorieGenresData = await selectGenreByShortStorieId(shortStorieItem.id)

        if(shortStorieParentalRatingData) {
            shortStorieItem.classificacao = shortStorieParentalRatingData

            if(shortStorieUserData) {
                shortStorieItem.usuario = shortStorieUserData

                if(publicationTypeData) {
                    shortStorieItem.tipo = publicationTypeData

                    if(shortStorieGenresData)
                        shortStorieItem.generos = shortStorieGenresData
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

                if(userAnnouncementArrayData) {
                    userItem.anuncios = userAnnouncementArrayData
    
                    if(userShortStorieArrayData)
                        userItem.historias_curtas = userShortStorieArrayData
                }
            }
        }
        return userItem
    })

    return userDataArray
}

module.exports = {
    destructureAnnouncementJson,
    destructureShortStorieJson,
    destructureUserJson
}