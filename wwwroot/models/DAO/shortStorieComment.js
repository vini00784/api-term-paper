/*
    Objetivo:     API responsible for handling short stories comments data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertShortStorieComment = async (comment) => {
    try {
        let sql = `CALL proc_auto_media_avaliation_short_story(
            '${comment.data}',
            '${comment.resenha}',
            ${comment.spoiler},
            '${comment.titulo}',
            ${comment.id_historia_curta},
            ${comment.id_usuario},
            ${comment.status},
            ${comment.avaliacao}
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

const deleteShortStorieComment = async (commentId, shortStorieId) => {
    try {
        let sql = `CALL proc_delete_comentario_historia_curta_auto_avaliation(${commentId}, ${shortStorieId})`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStorieComments = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id, data_publicacao, resenha, spoiler, titulo, avaliacao, id_historia_curta, id_usuario, status
        FROM tbl_comentario_historia_curta WHERE id_historia_curta = ${shortStorieId} AND status = true
        `

        const rsShortStorieComments = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorieComments.length > 0)
            return rsShortStorieComments
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertShortStorieCommentLike = async (commentLike) => {
    try {
        let sql = `INSERT INTO tbl_comentario_historia_curta_curtida (id_comentario_historia_curta, id_usuario) values (
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

const deleteShortStorieCommentLike = async (commentId, userId) => {
    try {
        let sql = `DELETE FROM tbl_comentario_historia_curta_curtida WHERE id_comentario_historia_curta = ${commentId} AND id_usuario = ${userId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countShortStorieComments = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(count(id) AS DECIMAL) AS quantidade_comentarios FROM tbl_comentario_historia_curta WHERE id_historia_curta =  ${shortStorieId} AND status = true`

        const rsComments = await prisma.$queryRawUnsafe(sql)

        if(rsComments.length > 0)
            return rsComments[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyShortStorieComment = async (shortStorieId, userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_comentario_historia_curta WHERE id_historia_curta = ${shortStorieId} AND id_usuario = ${userId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyShortStorieCommentLike = async (shortStorieId, userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_comentario_historia_curta_curtida WHERE id_comentario_historia_curta = ${shortStorieId} AND id_usuario = ${userId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countShortStorieCommentLikes = async (commentId) => {
    try {
        let sql = `SELECT cast(count(id) AS DECIMAL) AS quantidade_curtidas FROM tbl_comentario_historia_curta_curtida WHERE id_comentario_historia_curta = ${commentId}`

        const rsCommentLikes = await prisma.$queryRawUnsafe(sql)

        if(rsCommentLikes.length > 0)
            return rsCommentLikes[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorieComment,
    deleteShortStorieComment,
    selectShortStorieComments,
    insertShortStorieCommentLike,
    deleteShortStorieCommentLike,
    countShortStorieComments,
    verifyShortStorieComment,
    verifyShortStorieCommentLike,
    countShortStorieCommentLikes
}