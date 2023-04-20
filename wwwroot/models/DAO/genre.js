/*
    Objetivo:     API responsible for handling genre (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 24/02/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const {prisma} = require('../../libs/prisma.js')
const selectAllGenres = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) as id_genero, nome as nome_genero FROM tbl_generos ORDER BY nome ASC'

        const rsGenres = await prisma.$queryRawUnsafe(sql)

        if(rsGenres)
            return rsGenres
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectGenreByUserId = async (userId) => {
    try {
        let sql = `SELECT tbl_generos.id as id_genero, tbl_generos.nome as nome_genero
        
        FROM tbl_generos
        
        INNER JOIN tbl_usuario_genero
         ON tbl_generos.id = tbl_usuario_genero.id_generos
         
        INNER JOIN tbl_usuario
         ON tbl_usuario.id = tbl_usuario_genero.id_usuario
         
        WHERE tbl_usuario.id = ${userId}`

        const rsGenre = await prisma.$queryRawUnsafe(sql)

        if(rsGenre.length > 0)
            return rsGenre
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectGenreByAnnouncementId = async (announcementId) => {
    try {
        let sql = `SELECT cast(tbl_generos.id AS DECIMAL) AS id_genero, tbl_generos.nome
        FROM tbl_genero_anuncio
     
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_anuncio.id_genero
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_genero_anuncio.id_anuncio
     
        WHERE tbl_genero_anuncio.id_anuncio = ${announcementId}`

        const rsGenres = await prisma.$queryRawUnsafe(sql)

        if(rsGenres.length > 0)
            return rsGenres
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectGenreByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_generos.id AS DECIMAL) AS id_genero, tbl_generos.nome
        FROM tbl_genero_historia_curta
     
        INNER JOIN tbl_generos
           ON tbl_generos.id = tbl_genero_historia_curta.id_genero
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_genero_historia_curta.id_historia_curta
     
        WHERE tbl_genero_historia_curta.id_historia_curta = ${shortStorieId}`

        const rsGenres = await prisma.$queryRawUnsafe(sql)

        if(rsGenres.length > 0)
            return rsGenres
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    selectAllGenres,
    selectGenreByUserId,
    selectGenreByAnnouncementId,
    selectGenreByShortStorieId
}