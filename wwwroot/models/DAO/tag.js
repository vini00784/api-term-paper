/*
    Objetivo:     API responsible for handling tags data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const selectTagByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_tag.id as id_tag, tbl_tag.tag as nome_tag
        
        FROM tbl_tag
        
        INNER JOIN tbl_usuario_tag
         ON tbl_tag.id = tbl_usuario_tag.id_tag
         
        INNER JOIN tbl_usuario
         ON tbl_usuario.id = tbl_usuario_tag.id_usuario
         
        WHERE tbl_usuario.id = ${userId}`

        const rsTag = await prisma.$queryRawUnsafe(sql)

        if(rsTag.length > 0)
            return rsTag
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllTags = async () => {
    try {
        let sql = 'SELECT cast(id AS DECIMAL) AS id_tag, tag AS nome_tag FROM tbl_tag ORDER BY id DESC'

        const rsTags = await prisma.$queryRawUnsafe(sql)

        if(rsTags.length > 0)
            return rsTags
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    selectTagByUserId,
    selectAllTags
}