/*
    Objetivo:     File responsible for handling announcements (of books) data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Dashboard model
const dashboardModel = require('../models/DAO/dashboard.js')

const getAnnouncementRevenue = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const announcementRevenueData = await dashboardModel.selectAnnouncementRevenue(announcementId)

        if(announcementRevenueData) {
            let announcementRevenueJson = {}

            announcementRevenueJson = announcementRevenueData

            return { status: 200, message: announcementRevenueJson }
        } else
            return { status: 400, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const getAnnouncementsInfosFun = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const announcementRevenueData = await getAnnouncementRevenue(announcementId)
    
        const announcementData = {}

        if(announcementRevenueData)
            announcementData.receita = announcementRevenueData.message

        console.log(announcementData)

        return announcementData
    }
}

const getAnnouncementsInfos = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const dashboardInfos = await getAnnouncementsInfosFun(announcementId)

        if(dashboardInfos)
            return { status: 200, message: dashboardInfos }
        else
            return { status: 400, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

module.exports = {
    getAnnouncementsInfos
}