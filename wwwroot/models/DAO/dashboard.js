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
        let sql = `SELECT CAST(COUNT(tbl_anuncio.preco) AS DECIMAL) AS receita_gerada
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

module.exports = { 
    selectAnnouncementRevenue
 }