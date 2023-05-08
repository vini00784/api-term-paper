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

        // (in data_publicado_comment date, in resenha_comment varchar(2000), in spoiler_comment tinyint, in titulo_comment varchar(80),
        //  in id_short_story_comment int,in id_usuario_comment int, in status_comment tinyint, in avaliacao_comment smallint
        // )
        
        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorieComment = async (commentId) => {
    try {
        let sql = `CALL proc_delete_comentario_historia_curta(${commentId})`

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
    insertShortStorieComment,
    deleteShortStorieComment
}