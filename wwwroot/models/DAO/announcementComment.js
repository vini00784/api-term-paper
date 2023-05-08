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

const deleteAnnouncementComment = async (commentId) => {
    try {
        let sql = `CALL proc_delete_comentario_anuncio(${commentId})`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementComments = async (announcementId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id, data_publicado, resenha, id_resposta_comentario, spoiler, id_usuario, status, avaliacao, titulo
            FROM tbl_comentario_anuncio WHERE id_anuncio = ${announcementId}
        `

        const rsAnnouncementComments = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncementComments.length > 0)
            return rsAnnouncementComments
        else
            return false
    } catch (err) {
        console.log(err);
    }
}

const insertAnnouncementCommentLike = async (commentLike) => {
    try {
        let sql = `INSERT INTO tbl_comentario_curtida (id_comentario, id_usuario) values (
            ${commentLike.id_comentario},
            ${commentLike.id_usuario}
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
    insertAnnouncementComment,
    deleteAnnouncementComment,
    selectAnnouncementComments,
    insertAnnouncementCommentLike
}