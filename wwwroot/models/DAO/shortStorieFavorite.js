/*
    Objetivo:     API responsible for handling short stories favorites data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 06/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertShortStorieFavorite = async (shortStorieFavorite) => {
    try {
        let sql = `INSERT INTO tbl_favorito_historia_curta (id_historia_curta, id_usuario)
                                                    values (
                                                        ${shortStorieFavorite.id_historia_curta},
                                                        ${shortStorieFavorite.id_usuario}
                                                    )`

        const result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countShortStorieFavorites = async (shortStorieId) => {
    try {
        let sql = `SELECT id_historia_curta, cast(COUNT(id) AS DECIMAL) as quantidade_favoritos FROM tbl_favorito_historia_curta WHERE id_historia_curta = ${shortStorieId}`

        const rsLikes = await prisma.$queryRawUnsafe(sql)

        if(rsLikes.length > 0)
            return rsLikes[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorieFavorite = async (shortStorieFavorite) => {
    try {
        let sql = `DELETE FROM tbl_favorito_historia_curta WHERE id_historia_curta = ${shortStorieFavorite.id_historia_curta} AND id_usuario = ${shortStorieFavorite.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyShortStorieFavorite = async (shortStorieID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_favorito_historia_curta WHERE id_historia_curta = ${shortStorieID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectFavoritedShortStories = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium
        FROM tbl_favorito_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_favorito_historia_curta.id_historia_curta
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_favorito_historia_curta.id_usuario
     
        WHERE tbl_favorito_historia_curta.id_usuario = ${userId}`

        const rsFavoritedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsFavoritedShortStories.length > 0)
            return rsFavoritedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorieFavorite,
    countShortStorieFavorites,
    deleteShortStorieFavorite,
    verifyShortStorieFavorite,
    selectFavoritedShortStories
}