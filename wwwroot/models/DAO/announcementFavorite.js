/*
    Objetivo:     API responsible for handling announcements favorites data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 06/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertAnnouncementFavorite = async (announcementFavorite) => {
    try {
        let sql = `INSERT INTO tbl_anuncio_favorito (id_anuncio, id_usuario)
                                                    values (
                                                        ${announcementFavorite.id_anuncio},
                                                        ${announcementFavorite.id_usuario}
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

const countAnnouncementFavorites = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_curtidas FROM tbl_anuncio_favorito WHERE id_anuncio = ${announcementId}`

        const rsFavorites = await prisma.$queryRawUnsafe(sql)

        if(rsFavorites.length > 0)
            return rsFavorites[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementFavorite = async (announcementFavorite) => {

}

module.exports = {
    insertAnnouncementFavorite,
    countAnnouncementFavorites
}