/*
    Objetivo:     API responsible for handling announcements favorites data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 06/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertAnnouncementFavorite = async (announcementFavorite) => {
    try {
        let sql = `INSERT INTO tbl_anuncio_favorito (id_anuncio, id_usuario)
                                                    values (
                                                        ${announcementFavorite.id_anuncio},
                                                        ${announcementFavorite.id_usuario}
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

const countAnnouncementFavorites = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_favoritos FROM tbl_anuncio_favorito WHERE id_anuncio = ${announcementId}`

        const rsFavorites = await prisma.$queryRawUnsafe(sql)

        if(rsFavorites.length > 0)
            return rsFavorites[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementFavorite = async (announcementFavorite) => {
    try {
        let sql = `DELETE FROM tbl_anuncio_favorito WHERE id_anuncio = ${announcementFavorite.id_anuncio} AND id_usuario = ${announcementFavorite.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyAnnouncementFavorite = async (announcementID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_anuncio_favorito WHERE id_anuncio = ${announcementID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectFavoritedAnnouncements = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_anuncio_favorito
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_anuncio_favorito.id_anuncio
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_anuncio_favorito.id_usuario
     
        WHERE tbl_anuncio_favorito.id_usuario = ${userId}`

        const rsFavoritedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsFavoritedAnnouncements.length > 0)
            return rsFavoritedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncementFavorite,
    countAnnouncementFavorites,
    deleteAnnouncementFavorite,
    verifyAnnouncementFavorite,
    selectFavoritedAnnouncements
}