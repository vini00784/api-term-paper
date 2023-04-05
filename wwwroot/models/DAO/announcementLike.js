/*
    Objetivo:     API responsible for handling announcements likes data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

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

const deleteAnnouncementLike = async () => {

}

module.exports = {
    insertAnnouncementLike
}