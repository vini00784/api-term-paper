/*
    Objetivo:     API responsible for handling tags data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/03/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const selectTagByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_tag.id, tbl_tag.tag
        
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
        let sql = 'SELECT cast(id AS decimal) AS id, tag FROM tbl_tag ORDER BY id DESC'

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