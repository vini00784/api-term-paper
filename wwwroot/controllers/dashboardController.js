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

// Utils functions
const { countAnnouncementLikes } = require('../models/DAO/announcementLike.js')
const { countAnnouncementFavorites } = require('../models/DAO/announcementFavorite.js')
const { countAnnouncementReads } = require('../models/DAO/announcementRead.js')
const { countAnnouncementPurchases } = require('../models/DAO/buy.js')
const { countAnnouncementRecommendations } = require('../models/DAO/recommendation.js')

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
        const announcementLikesData = await countAnnouncementLikes(announcementId)
        const announcementFavoritesData = await countAnnouncementFavorites(announcementId)
        const announcementReadsData = await countAnnouncementReads(announcementId)
        const announcementPurchasesData = await countAnnouncementPurchases(announcementId)
        const announcementRecommendationsData = await countAnnouncementRecommendations(announcementId)
        const userTagsData = await dashboardModel.selectUserTagsData(announcementId)
        const announcementRatesData = await dashboardModel.selectAnnouncementRates(announcementId)
        const announcementRatesPercentData = await dashboardModel.selectAnnouncementRatesPercent(announcementId)
        const announcementSellByWeekData = await dashboardModel.selectSellDataByWeek(announcementId)
        const announcementMaxValue = await dashboardModel.selectMaxValue(announcementId)
        
        const announcementData = {}
        
        if(announcementRevenueData)
            announcementData.receita = announcementRevenueData.message
        
        if(announcementLikesData.quantidade_curtidas)
            announcementData.curtidas = announcementLikesData
        
        if(announcementFavoritesData.quantidade_favoritos)
            announcementData.favoritos = announcementFavoritesData
        
        if(announcementReadsData.quantidade_lidos)
            announcementData.lidos = announcementReadsData
        
        if(announcementPurchasesData.quantidade_compras)
            announcementData.compras = announcementPurchasesData
        
        if(announcementRecommendationsData.quantidade_recomendacoes)
            announcementData.recomendacoes = announcementRecommendationsData
        
        if(userTagsData)
            announcementData.dados_usuarios = userTagsData

        if(announcementRatesData)
            announcementData.avaliacoes = announcementRatesData

        if(announcementRatesPercentData)
            announcementData.percentual_avaliacoes = announcementRatesPercentData

        if(announcementSellByWeekData) {
            announcementData.weekSell = announcementSellByWeekData
        }

        if (announcementMaxValue) {
            const roundedValue = parseInt((parseInt(announcementMaxValue.maior_valor) / 5) + 1) * 5

            announcementData.roundedData = roundedValue
        }

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