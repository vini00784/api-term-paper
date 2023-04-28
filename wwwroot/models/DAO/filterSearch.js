/*
    Objetivo:     API responsible for handling announcements (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

// Seleciona todos os anúncios referidos a determinados parametros de filtros
const selectAnnouncementByFilters = async (genresId, minPrice, maxPrice) => {
    try {
        let sqlFrom = "tbl_anuncio"
        let sqlWhere = "tbl_anuncio.status = true"

        if (genresId != "") {
            sqlFrom = `tbl_genero_anuncio
     
            INNER JOIN tbl_anuncio
               ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
            INNER JOIN tbl_generos
               ON tbl_generos.id = tbl_genero_anuncio.id_genero
            INNER JOIN tbl_usuario
               ON tbl_usuario.id = tbl_anuncio.id_usuario`

            sqlWhere += ` AND tbl_genero_anuncio.id_genero in(${genresId})`
        }

        if (minPrice != "")
            sqlWhere += ` AND tbl_anuncio.preco >= ${minPrice}`

        if (maxPrice != "")
            sqlWhere += ` AND tbl_anuncio.preco <= ${maxPrice}`

        let sqlBase = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.preco
        FROM ${sqlFrom}
     
        WHERE ${sqlWhere}
        ORDER BY tbl_anuncio.id DESC`

        const rsAnnouncement = await prisma.$queryRawUnsafe(sqlBase)

        console.log(rsAnnouncement);

        console.log(rsAnnouncement);
        if(rsAnnouncement.length > 0)
            return rsAnnouncement
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    selectAnnouncementByFilters
}