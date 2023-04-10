/*
    Objetivo:     File responsible for handling complaints data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 10/04/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Complaints model
const complaintsModel = require('../models/DAO/announcementComplaint.js')

const newAnnouncementComplaint = async (announcementComplaint) => {
    if(announcementComplaint.descricao == '' || announcementComplaint.descricao == undefined || announcementComplaint.id_anuncio == '' || announcementComplaint.id_anuncio == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newAnnouncementComplaint = await complaintsModel.insertAnnouncementComplaint(announcementComplaint)

        if(newAnnouncementComplaint) {
            let newAnnouncementComplaintId = await complaintsModel.selectLastAnnouncementComplaintId()

            if(newAnnouncementComplaintId > 0) {
                let announcementComplaintType = {}

                announcementComplaintType.id_denuncia = newAnnouncementComplaintId

                let announcementTypeArrayLength = announcementComplaint.tipo.length
                let resultNewAnnouncementComplaintType
                for(let i = 0; i < announcementTypeArrayLength; i++) {
                    announcementComplaintType.id_tipo_denuncia = announcementComplaint.tipo[i].id_tipo_denuncia
                    resultNewAnnouncementComplaintType = await complaintsModel.insertAnnouncementComplaintType(announcementComplaintType)
                }

                if(resultNewAnnouncementComplaintType)
                    return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                else {
                    await complaintsModel.deleteAnnouncementComplaint(newAnnouncementComplaintId)
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                }
            } else {
                await complaintsModel.deleteAnnouncementComplaint(newAnnouncementComplaintId)
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
            }
        }
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

module.exports = {
    newAnnouncementComplaint
}