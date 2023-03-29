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
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined || announcement.epub == '' || announcement.epub == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(announcement.titulo.length > 50 || announcement.capa.length > 500 || announcement.sinopse.length > 2000 || announcement.pdf.length > 500 || announcement.epub.length > 500 || announcement.mobi?.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        announcement.data = currentDate
        announcement.status = 1
        announcement.premium = 0

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
    if(announcement.titulo == '' || announcement.titulo == undefined || announcement.volume == '' || announcement.volume == undefined || announcement.capa == '' || announcement.capa == undefined || announcement.premium == '' || announcement.premium == undefined || announcement.sinopse == '' || announcement.sinopse == undefined || announcement.quantidade_paginas == ''|| announcement.quantidade_paginas == undefined || announcement.preco == '' || announcement.preco == undefined || announcement.pdf == '' || announcement.pdf == undefined || announcement.epub == '' || announcement.epub == undefined || announcement.mobi == '' || announcement.mobi == undefined || announcement.id_classificacao == '' || announcement.id_classificacao == undefined || announcement.id_usuario == '' || announcement.id_usuario == undefined || announcement.id_tipo_publicacao == '' || announcement.id_tipo_publicacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(announcement.titulo.length > 50 || announcement.capa.length > 200 || announcement.sinopse.length > 300 || announcement.pdf.length > 200 || announcement.epub.length > 200 || announcement.mobi.length > 200)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        announcement.data = currentDate
        
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

const deleteAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const deletedAnnouncement = await announcementModel.deleteAnnouncement(announcementId)

        if(deletedAnnouncement)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const listAllAnnouncements = async () => {
    let announcementsJson = {}

    const { selectParentalRatingByAnnouncementId } = require('../models/DAO/parentalRating.js')
    const { selectUserByAnnouncementId, selectPublicationTypeByAnnouncementId } = require ('../models/DAO/announcement.js')
    const { selectGenreByAnnouncementId } = require('../models/DAO/genre.js')

    const announcementsData = await announcementModel.selectAllAnnouncements()

    if(announcementsData) {
        const announcementsDataArray = announcementsData.map(async announcementItem => {
            const announcementParentalRatingData = await selectParentalRatingByAnnouncementId(announcementItem.id)
            const announcementUserData = await selectUserByAnnouncementId(announcementItem.id)
            const publicationTypeData = await selectPublicationTypeByAnnouncementId(announcementItem.id)
            const announcementGenresData = await selectGenreByAnnouncementId(announcementItem.id)
            
            if(announcementParentalRatingData) {
                announcementItem.classificacao = announcementParentalRatingData

                if(announcementUserData) {
                    announcementItem.usuario = announcementUserData

                    if(publicationTypeData) {
                        announcementItem.tipo = publicationTypeData

                        if(announcementGenresData)
                            announcementItem.generos = announcementGenresData
                    }
                }
            }

            return announcementItem
        })
        
        announcementsJson = await Promise.all(announcementsDataArray)
        return { status: 200, message: announcementsJson }
    }
    else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const desactivateAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const desactivatedAnnouncement = await announcementModel.desactivateAnnouncement(announcementId)

        if(desactivatedAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.DESACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const activateAnnouncement = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const activatedAnnouncement = await announcementModel.activateAnnouncement(announcementId)

        if(activatedAnnouncement)
            return { status: 200, message: MESSAGE_SUCCESS.ACTIVATE_ITEM }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const searchAnnouncementById = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementData = await announcementModel.selectAnnouncementById(announcementId)

        const { selectParentalRatingByAnnouncementId } = require('../models/DAO/parentalRating.js')
        const { selectUserByAnnouncementId, selectPublicationTypeByAnnouncementId } = require ('../models/DAO/announcement.js')
        const { selectGenreByAnnouncementId } = require('../models/DAO/genre.js')

        if(announcementData) {
            let announcementJson = {}

            const announcementDataArray = announcementData.map(async announcementItem => {
                const announcementParentalRatingData = await selectParentalRatingByAnnouncementId(announcementItem.id)
                const announcementUserData = await selectUserByAnnouncementId(announcementItem.id)
                const publicationTypeData = await selectPublicationTypeByAnnouncementId(announcementItem.id)
                const announcementGenresData = await selectGenreByAnnouncementId(announcementItem.id)
            
                if(announcementParentalRatingData) {
                    announcementItem.classificacao = announcementParentalRatingData

                    if(announcementUserData) {
                        announcementItem.usuario = announcementUserData

                        if(publicationTypeData) {
                            announcementItem.tipo = publicationTypeData

                            if(announcementGenresData)
                                announcementItem.generos = announcementGenresData
                        }
                    }
                }

                return announcementItem
            })

            announcementJson = await Promise.all(announcementDataArray)
            return { status: 200, message: announcementJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

module.exports = {
    newAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    listAllAnnouncements,
    desactivateAnnouncement,
    activateAnnouncement,
    searchAnnouncementById
}