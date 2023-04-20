/*
    Objetivo:     API responsible for handling announcements Reads data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const {prisma} = require('../../libs/prisma.js')
const insertAnnouncementRead = async (announcementRead) => {
    try {
        let sql = `INSERT INTO tbl_quantidade_lidos_anuncio (id_anuncio, id_usuario)
                                                    values (
                                                        ${announcementRead.id_anuncio},
                                                        ${announcementRead.id_usuario}
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

const countAnnouncementReads = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) as quantidade_lido FROM tbl_quantidade_lidos_anuncio WHERE id_anuncio = ${announcementId}`

        const rsReads = await prisma.$queryRawUnsafe(sql)

        if(rsReads.length > 0)
            return rsReads[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementRead = async (announcementRead) => {
    try {
        let sql = `DELETE FROM tbl_quantidade_lidos_anuncio WHERE id_anuncio = ${announcementRead.id_anuncio} AND id_usuario = ${announcementRead.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyAnnouncementRead = async (announcementID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_quantidade_lidos_anuncio WHERE id_anuncio = ${announcementID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectReadedAnnouncements = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_quantidade_lidos_anuncio
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_quantidade_lidos_anuncio.id_anuncio
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_quantidade_lidos_anuncio.id_usuario
     
        WHERE tbl_quantidade_lidos_anuncio.id_usuario = ${userId}`

        const rsReadedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsReadedAnnouncements.length > 0)
            return rsReadedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncementRead,
    countAnnouncementReads,
    deleteAnnouncementRead,
    verifyAnnouncementRead,
    selectReadedAnnouncements
}