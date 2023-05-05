/*
    Objetivo:     API responsible for handling announcements comments data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 04/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertAnnouncementComment = async (comment) => {
    try {
        let sql = `CALL proc_auto_media_avaliation_announcement(
            '${comment.data}',
            '${comment.resenha}',
            ${comment.id_resposta},
            ${comment.spoiler},
            ${comment.id_usuario},
            ${comment.id_anuncio},
            ${comment.status},
            ${comment.avaliacao},
            '${comment.titulo}'
        )`
        
        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncementComment
}