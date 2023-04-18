/*
    Objetivo:     API responsible for handling parental ratings (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const selectAllParentalRatings = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) AS id_classificacao, classificacao, descricao, icone FROM tbl_classificacao_indicativa'

        const rsParentalRatings = await prisma.$queryRawUnsafe(sql)

        if(rsParentalRatings)
            return rsParentalRatings
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectParentalRatingByAnnouncementId = async (announcementId) => {
    try {
        let sql = `SELECT cast(tbl_classificacao_indicativa.id AS DECIMAL) as id_classificacao, tbl_classificacao_indicativa.classificacao, tbl_classificacao_indicativa.descricao, tbl_classificacao_indicativa.icone
        FROM tbl_anuncio
     
        INNER JOIN tbl_classificacao_indicativa
           ON tbl_classificacao_indicativa.id = tbl_anuncio.id_classificacao
     
        WHERE tbl_anuncio.id = ${announcementId}`

        const rsParentalRating = await prisma.$queryRawUnsafe(sql)

        if(rsParentalRating.length > 0)
            return rsParentalRating
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectParentalRatingByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_classificacao_indicativa.id AS DECIMAL) as id_classificacao, tbl_classificacao_indicativa.classificacao, tbl_classificacao_indicativa.descricao, tbl_classificacao_indicativa.icone
        FROM tbl_historia_curta
     
        INNER JOIN tbl_classificacao_indicativa
           ON tbl_classificacao_indicativa.id = tbl_historia_curta.id_classificacao_indicativa
     
        WHERE tbl_historia_curta.id = ${shortStorieId}`

        const rsParentalRating = await prisma.$queryRawUnsafe(sql)

        if(rsParentalRating.length > 0)
            return rsParentalRating
        else
            return false
    } catch (err) {
        console.log(err)    
    }
}

module.exports = {
    selectAllParentalRatings,
    selectParentalRatingByAnnouncementId,
    selectParentalRatingByShortStorieId
}