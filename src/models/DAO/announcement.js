/*
    Objetivo:     API responsible for handling announcements (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertAnnouncement = async (announcement, genresId) => {
    try {
        let sql = `CALL proc_insert_anuncio (
                                                '${announcement.titulo}', 
                                                ${announcement.volume}, 
                                                '${announcement.capa}', 
                                                ${announcement.status}, 
                                                ${announcement.premium},
                                                '${announcement.sinopse}',
                                                '${announcement.data}',
                                                ${announcement.quantidade_paginas},
                                                ${announcement.preco},
                                                '${announcement.pdf}',
                                                '${announcement.epub}',
                                                '${announcement.mobi}',
                                                ${announcement.id_classificacao},
                                                ${announcement.id_usuario},
                                                ${announcement.id_tipo_publicacao},
                                                '${genresId}'
                                                )`
                        
        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const updateAnnouncement = async () => {

}

const deleteAnnouncement = async () => {

}

const selectAllAnnouncements = async () => {

}

module.exports = {
    insertAnnouncement
}