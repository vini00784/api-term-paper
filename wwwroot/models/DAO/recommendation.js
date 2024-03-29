/*
    Objetivo:     API responsible for handling recommendations (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 12/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertRecommendation = async (recommendation) => {
    try {
        let sql = `INSERT INTO tbl_recomendacao (conteudo, data_hora, id_usuario, id_anuncio, spoiler) values (
            '${recommendation.conteudo}',
            '${recommendation.data_publicado}',
            ${recommendation.id_usuario},
            ${recommendation.id_anuncio},
            ${recommendation.spoiler}
        )`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteRecommendation = async (recommendationId) => {
    try {
        let sql = `DELETE FROM tbl_recomendacao WHERE id = ${recommendationId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertRecommendationLike = async (recommendationLike) => {
    try {
        let sql = `INSERT INTO tbl_recomendacao_curtida (id_recomendacao, id_usuario) values (
            ${recommendationLike.id_recomendacao},
            ${recommendationLike.id_usuario}
        )`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteRecommendationLike = async (recommendationId, userId) => {
    try {
        let sql = `DELETE FROM tbl_recomendacao_curtida WHERE id_recomendacao = ${recommendationId} AND id_usuario = ${userId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertRecommendationFavorite = async (recommendationFavorite) => {
    try {
        let sql = `INSERT INTO tbl_favorito_recomendacao (id_recomendacao, id_usuario) values (
            ${recommendationFavorite.id_recomendacao},
            ${recommendationFavorite.id_usuario}
        )`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteRecommendationFavorite = async (recommendationId, userId) => {
    try {
        let sql = `DELETE FROM tbl_favorito_recomendacao WHERE id_recomendacao = ${recommendationId} AND id_usuario = ${userId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectRecommendationById = async (recommendationId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id, conteudo, data_hora, id_usuario, id_anuncio, spoiler FROM tbl_recomendacao WHERE id = ${recommendationId}`

        const rsRecommendation = await prisma.$queryRawUnsafe(sql)

        if(rsRecommendation.length > 0)
            return rsRecommendation
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countRecommendationLikes = async (recommendationId) => {
    try {
        let sql = `SELECT cast(COUNT(id) AS DECIMAL) AS quantidade_curtidas FROM tbl_recomendacao_curtida WHERE id_recomendacao = ${recommendationId}`

        const rsLikes = await prisma.$queryRawUnsafe(sql)

        if(rsLikes.length > 0)
            return rsLikes[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countRecommendationFavorites = async (recommendationId) => {
    try {
        let sql = `SELECT cast(COUNT(id) AS DECIMAL) AS quantidade_favoritos FROM tbl_favorito_recomendacao WHERE id_recomendacao = ${recommendationId}`

        const rsFavorites = await prisma.$queryRawUnsafe(sql)

        if(rsFavorites.length > 0)
            return rsFavorites[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectRecommendationsByFollowingUsers = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_recomendacao.id AS DECIMAL) AS id, tbl_recomendacao.conteudo, tbl_recomendacao.data_hora, tbl_recomendacao.id_usuario, tbl_recomendacao.id_anuncio, tbl_recomendacao.spoiler 
        FROM tbl_seguidor_seguidores

        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
        INNER JOIN tbl_recomendacao
            ON tbl_usuario.id = tbl_recomendacao.id_usuario

        WHERE tbl_seguidor_seguidores.id_segue = ${userId}`

        const rsRecommendations = await prisma.$queryRawUnsafe(sql)

        if(rsRecommendations.length > 0)
            return rsRecommendations
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectRecommendationsByUserId = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_recomendacao.id AS DECIMAL) AS id, tbl_recomendacao.conteudo, tbl_recomendacao.data_hora, tbl_recomendacao.id_usuario, tbl_recomendacao.id_anuncio, tbl_recomendacao.spoiler
        FROM tbl_recomendacao
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_recomendacao.id_usuario
        WHERE tbl_recomendacao.id_usuario = ${userId}`

        const rsRecommendations = await prisma.$queryRawUnsafe(sql)

        if(rsRecommendations.length > 0)
            return rsRecommendations
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyRecommendationLike = async (recommendationId, userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_recomendacao_curtida WHERE id_recomendacao = ${recommendationId} AND id_usuario = ${userId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyRecommendationFavorite = async (recommendationId, userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_favorito_recomendacao WHERE id_recomendacao = ${recommendationId} AND id_usuario = ${userId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countAnnouncementRecommendations = async (announcementId) => {
    try {
        let sql = `SELECT CAST(COUNT(id) AS DECIMAL) AS quantidade_recomendacoes FROM tbl_recomendacao WHERE id_anuncio = ${announcementId}`

        const rsRecommendations = await prisma.$queryRawUnsafe(sql)

        if(rsRecommendations.length > 0)
            return rsRecommendations[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertRecommendation,
    deleteRecommendation,
    insertRecommendationLike,
    deleteRecommendationLike,
    insertRecommendationFavorite,
    deleteRecommendationFavorite,
    selectRecommendationById,
    countRecommendationLikes,
    countRecommendationFavorites,
    selectRecommendationsByFollowingUsers,
    selectRecommendationsByUserId,
    verifyRecommendationLike,
    verifyRecommendationFavorite,
    countAnnouncementRecommendations
}