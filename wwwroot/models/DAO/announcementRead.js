/*
    Objetivo:     API responsible for handling announcements Reads data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertAnnouncementRead = async (announcementRead) => {
    try {
        let sql = `INSERT INTO tbl_quantidade_lidos_anuncio (id_anuncio, id_usuario)
                                                    values (
                                                        ${announcementRead.id_anuncio},
                                                        ${announcementRead.id_usuario}
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

const countAnnouncementReads = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_lido FROM tbl_quantidade_lidos_anuncio WHERE id_anuncio = ${announcementId}`

        const rsReads = await prisma.$queryRawUnsafe(sql)

        if(rsReads.length > 0)
            return rsReads[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementRead = async (announcementRead) => {
    
}

module.exports = {
    insertAnnouncementRead,
    countAnnouncementReads
}