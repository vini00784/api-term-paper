/*
    Objetivo:     API responsible for handling announcements likes data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertAnnouncementLike = async (announcementLike) => {
    try {
        let sql = `INSERT INTO tbl_anuncio_curtida (id_anuncio, id_usuario)
                                                    values (
                                                        ${announcementLike.id_anuncio},
                                                        ${announcementLike.id_usuario}
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

const countAnnouncementLikes = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_curtidas FROM tbl_anuncio_curtida WHERE id_anuncio = ${announcementId}`

        const rsLikes = await prisma.$queryRawUnsafe(sql)

        if(rsLikes.length > 0)
            return rsLikes[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementLike = async (announcementLike) => {
    try {
        let sql = `DELETE FROM tbl_anuncio_curtida WHERE id_anuncio = ${announcementLike.id_anuncio} AND id_usuario = ${announcementLike.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyAnnouncementLike = async (announcementID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_anuncio_curtida WHERE id_anuncio = ${announcementID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncementLike,
    countAnnouncementLikes,
    deleteAnnouncementLike,
    verifyAnnouncementLike
}