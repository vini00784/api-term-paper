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

module.exports = {
    insertRecommendation,
    deleteRecommendation,
    insertRecommendationLike,
    deleteRecommendationLike,
    insertRecommendationFavorite
}