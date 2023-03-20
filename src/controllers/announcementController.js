/*
    Objetivo:     File responsible for handling announcements (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Announcement model
const announcementModel = require('../models/DAO/announcement.js')

const newAnnouncement = async (announcement) => {
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.premium == '' || announcement.premium == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined || announcement.epub == '' || announcement.epub == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    if(announcement.titulo.length > 50 || announcement.capa.length > 200 || announcement.sinopse.length > 300 || announcement.pdf.length > 200 || announcement.epub.length > 200 || announcement.mobi.length > 200)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        announcement.data = currentDate
        announcement.status = 1

        let announcementGenresLength = announcement.generos.length
        let genresId = ""

        for(let i = 0; i < announcementGenresLength; i++) {
            if(announcementGenresLength == 1)
                genresId += `(@id_anuncio_criado, ${announcement.generos[0].id_genero})`

            else if (i == announcementGenresLength - 1) 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero})`

            else 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero}), `
            
        }

        const resultNewAnnouncement = await announcementModel.insertAnnouncement(announcement, genresId)

        if(resultNewAnnouncement)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const updateAnnouncement = async (announcement) => {
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.status == ''|| announcement.status == undefined || announcement.premium == '' || announcement.premium == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.epub == '' || announcement.epub == undefined || announcement.mobi == '' || announcement.mobi == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(announcement.titulo.length > 50 || announcement.capa.length > 200 || announcement.sinopse.length > 300 || announcement.pdf.length > 200 || announcement.epub.length > 200 || announcement.mobi.length > 200)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        let announcementGenresLength = announcement.generos.length
        let genresId = ""

        for(let i = 0; i < announcementGenresLength; i++) {
            if(announcementGenresLength == 1)
                genresId += `(@id_anuncio_criado, ${announcement.generos[0].id_genero})`

            else if (i == announcementGenresLength - 1) 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero})`

            else 
                genresId += `(@id_anuncio_criado, ${announcement.generos[i].id_genero}), `
            
        }
        
        const updatedAnnouncement = await announcementModel.updateAnnouncement(announcement, genresId)

        if(updatedAnnouncement)
                return {status: 200, message: MESSAGE_SUCCESS.UPDATE_ITEM}
            else
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const deleteAnnouncement = async () => {

}

const selectAllAnnouncements = async () => {

}

module.exports = {
    newAnnouncement,
    updateAnnouncement
}