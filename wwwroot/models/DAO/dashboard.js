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
        let sql = `SELECT ROUND(SUM(tbl_anuncio.preco), 2) AS receita_gerada
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
        (CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 1 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_somente_escritor,
        (CAST(COUNT(CASE WHEN tbl_usuario_tag.id_tag = 2 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_somente_leitor
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

const selectAnnouncementRates = async (announcementId) => {
    try {
        let sql = `SELECT CAST(tbl_comentario_anuncio.id AS DECIMAL) AS id, tbl_comentario_anuncio.titulo, tbl_comentario_anuncio.resenha, tbl_comentario_anuncio.avaliacao
        FROM tbl_comentario_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_comentario_anuncio.id_anuncio
     
        WHERE tbl_comentario_anuncio.id_anuncio = ${announcementId}`

        const rsAnnouncementRates = await prisma.$queryRawUnsafe(sql)

        if(rsAnnouncementRates.length > 0)
            return rsAnnouncementRates
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAnnouncementRatesPercent = async (announcementId) => {
    try {
        let sql = `SELECT
        CAST(COUNT(tbl_comentario_anuncio.id) AS DECIMAL) AS total_avaliacoes,
        (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 1 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_um,
        (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 2 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_dois,
        (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 3 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_tres,
        (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 4 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_quatro,
        (CAST(COUNT(CASE WHEN tbl_comentario_anuncio.avaliacao = 5 THEN 0 END) AS DECIMAL) * 100) / COUNT(*) AS porcentagem_avaliacao_cinco
        FROM tbl_comentario_anuncio
        
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_comentario_anuncio.id_anuncio
        
        WHERE tbl_comentario_anuncio.id_anuncio = ${announcementId}
        GROUP BY tbl_anuncio.id`

        const rsAnnouncementsRatesPercent = await prisma.$queryRawUnsafe(sql)

        // console.log(rsAnnouncementsRatesPercent)

        if(rsAnnouncementsRatesPercent.length > 0)
            return rsAnnouncementsRatesPercent[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectSellDataByWeek = async (announcementId) => {
    try {
        let sellData = {}

        let sqlDate = `SELECT tbl_livros_comprados.data_compra
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
     
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId} AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY tbl_livros_comprados.data_compra`

        let sqlSales = `SELECT CAST(COUNT(*) AS DECIMAL) AS quantidade_vendas
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
     
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId} AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY tbl_livros_comprados.data_compra`

        let sqlInvoicing = `SELECT SUM(tbl_anuncio.preco) AS faturamento
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
     
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId} AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY tbl_livros_comprados.data_compra`

        sellData.dates = await prisma.$queryRawUnsafe(sqlDate)

        sellData.sales = await prisma.$queryRawUnsafe(sqlSales)

        // sellData.invoicing = await prisma.$queryRawUnsafe(sqlInvoicing)

        if(sellData)
            return sellData
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectMaxValue = async (announcementId) => {
    try {
        let sql = `SELECT CAST(COUNT(*) AS DECIMAL) AS maior_valor
        FROM tbl_livros_comprados
     
        WHERE tbl_livros_comprados.id_anuncio = ${announcementId} AND tbl_livros_comprados.data_compra >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY tbl_livros_comprados.data_compra
        ORDER BY maior_valor DESC LIMIT 1`


        const rsMaxValue = await prisma.$queryRawUnsafe(sql)

        if(rsMaxValue.length > 0)
            return rsMaxValue[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    selectAnnouncementRevenue,
    selectUserTagsData,
    selectAnnouncementRates,
    selectAnnouncementRatesPercent,
    selectSellDataByWeek,
    selectMaxValue
 }