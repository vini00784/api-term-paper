/*
    Objetivo:     File responsible for handling complaints data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 10/04/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Complaints models
const announcementComplaintModel = require('../models/DAO/announcementComplaint.js')
const shortStorieComplaintModel = require('../models/DAO/shortStorieComplaint.js')
const userComplaintModel = require('../models/DAO/userComplaint.js')

const newAnnouncementComplaint = async (announcementComplaint) => {
    if(announcementComplaint.descricao == '' || announcementComplaint.descricao == undefined || announcementComplaint.id_anuncio == '' || announcementComplaint.id_anuncio == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newAnnouncementComplaint = await announcementComplaintModel.insertAnnouncementComplaint(announcementComplaint)

        if(newAnnouncementComplaint) {
            let newAnnouncementComplaintId = await announcementComplaintModel.selectLastAnnouncementComplaintId()

            if(newAnnouncementComplaintId > 0) {
                let announcementComplaintType = {}

                announcementComplaintType.id_denuncia = newAnnouncementComplaintId

                let announcementTypeArrayLength = announcementComplaint.tipo.length
                let resultNewAnnouncementComplaintType
                for(let i = 0; i < announcementTypeArrayLength; i++) {
                    announcementComplaintType.id_tipo_denuncia = announcementComplaint.tipo[i].id_tipo_denuncia
                    resultNewAnnouncementComplaintType = await announcementComplaintModel.insertAnnouncementComplaintType(announcementComplaintType)
                }

                if(resultNewAnnouncementComplaintType)
                    return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                else {
                    await announcementComplaintModel.deleteAnnouncementComplaint(newAnnouncementComplaintId)
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                }
            } else {
                await announcementComplaintModel.deleteAnnouncementComplaint(newAnnouncementComplaintId)
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
            }
        }
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const newShortStorieComplaint = async (shortStorieComplaint) => {
    if(shortStorieComplaint.descricao == '' || shortStorieComplaint.descricao == undefined || shortStorieComplaint.id_historia_curta == '' || shortStorieComplaint.id_historia_curta == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newShortStorieComplaint = await shortStorieComplaintModel.insertShortStorieComplaint(shortStorieComplaint)

        if(newShortStorieComplaint) {
            let newShortStorieComplaintId = await shortStorieComplaintModel.selectLastShortStorieComplaintId()

            if(newShortStorieComplaintId > 0) {
                let shortStorieComplaintType = {}

                shortStorieComplaintType.id_denuncia_historia_curta = newShortStorieComplaintId

                let shortStorieComplaintTypeLength = shortStorieComplaint.tipo.length
                let resultNewShortStorieComplaintType
                for(let i = 0; i < shortStorieComplaintTypeLength; i++) {
                    shortStorieComplaintType.id_tipo_denuncia = shortStorieComplaint.tipo[i].id_tipo_denuncia
                    resultNewShortStorieComplaintType = await shortStorieComplaintModel.insertShortStorieComplaintType(shortStorieComplaintType)
                }

                if(resultNewShortStorieComplaintType)
                    return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                else {
                    await shortStorieComplaintModel.deleteShortStorieComplaint(newShortStorieComplaintId)
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                }
            } else {
                await shortStorieComplaintModel.deleteShortStorieComplaint(newShortStorieComplaintId)
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
            }
        } else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const newUserComplaint = async (userComplaint) => {
    if(userComplaint.descricao == '' || userComplaint.descricao == undefined || userComplaint.id_usuario == '' || userComplaint.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newUserComplaint = await userComplaintModel.insertUserComplaint(userComplaint)

        if(newUserComplaint) {
            let newUserComplaintId = await userComplaintModel.selectLastUserComplaintId()

            if(newUserComplaintId > 0) {
                let userComplaintType = {}

                userComplaintType.id_denuncia = newUserComplaintId

                let userComplaintTypeLength = userComplaint.tipo.length
                let resultNewUserComplaintType
                for(let i = 0; i < userComplaintTypeLength; i++) {
                    userComplaintType.id_tipo_denuncia = userComplaint.tipo[i].id_tipo_denuncia
                    resultNewUserComplaintType = await userComplaintModel.insertUserComplaintType(userComplaintType)
                }

                if(resultNewUserComplaintType)
                    return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                else {
                    await userComplaintModel.deleteUserComplaint(newUserComplaintId)
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                }
            } else {
                await userComplaintModel.deleteUserComplaint(newUserComplaintId)
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
            }
        } else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const listAllComplaintTypes = async () => {
    const complaintTypesData = await announcementComplaintModel.selectAllComplaintTypes()

    if(complaintTypesData) {
        let complaintTypesJson = {}

        complaintTypesJson = complaintTypesData
        return { status: 200, message: complaintTypesJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

module.exports = {
    newAnnouncementComplaint,
    newShortStorieComplaint,
    newUserComplaint,
    listAllComplaintTypes
}