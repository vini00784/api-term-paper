/*
    Objetivo:     API responsible for handling dashboard data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 26/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const { filterAnnouncementsByGenresPrice } = require('../../controllers/announcementController.js')
const prisma = require('../../libs/prisma.js')

const selectAnnouncementRevenue = async (announcementId) => {
    try {
        let sql = `SELECT SUM(tbl_anuncio.preco) AS receita_gerada
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
     
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId}`

        const rsRevenue = await prisma.$queryRawUnsafe(sql)

        if(rsRevenue.length > 0)
            return rsRevenue[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectUserTagsData = async (announcementId) => {
    try {
        let sql = `SELECT 
        CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 1 THEN 0 END) AS DECIMAL) AS somente_escritor,
        CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 2 THEN 0 END) AS DECIMAL) AS somente_leitor
        FROM tbl_usuario_tag
     
        INNER JOIN tbl_tag
           ON tbl_tag.id = tbl_usuario_tag.id_tag
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_usuario_tag.id_usuario
        INNER JOIN tbl_livros_comprados
           ON tbl_usuario.id = tbl_livros_comprados.id_usuario
           
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId}`

        const rsUserTags = await prisma.$queryRawUnsafe(sql)

        if(rsUserTags.length > 0)
            return rsUserTags[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    selectAnnouncementRevenue,
    selectUserTagsData
 }