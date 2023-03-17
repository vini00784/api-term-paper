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

const insertAnnouncement = async (announcement) => {
    try {
        let sql = `INSERT INTO tbl_anuncio (
                                                titulo,
                                                volume,
                                                capa,
                                                status,
                                                premium,
                                                sinopse,
                                                data,
                                                quantidade_paginas,
                                                preco,
                                                pdf,
                                                id_classificacao,
                                                id_usuario,
                                                id_tipo_publicacao,
                                                epub,
                                                mobi
                                            ) values (
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
                                                ${announcement.id_classificacao},
                                                ${announcement.id_usuario},
                                                ${announcement.id_tipo_publicacao},
                                                '${announcement.epub}',
                                                '${announcement.mobi}'
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

const updateAnnouncement = async () => {

}

const deleteAnnouncement = async () => {

}

const selectAllAnnouncements = async () => {

}

module.exports = {
    insertAnnouncement
}