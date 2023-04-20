/*
    Objetivo:     File responsible for handling buys of books data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 20/04/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Buy model
const buyModel = require('../models/DAO/buy.js')

const newBuyWithoutCart = async (buy) => {
    if(buy.id_anuncio == '' || buy.id_anuncio == undefined || buy.id_usuario == '' || buy.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const resultNewBuy = await buyModel.insertBuyWithoutCart(buy)

        if(resultNewBuy)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const putAnnouncementInCart = async (cart) => {
    if(cart.id_anuncio == '' || cart.id_anuncio == undefined || cart.id_usuario == '' || cart.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        cart.status = 0

        const newAnnouncementInCart = await buyModel.insertAnnouncementInCart(cart)

        if(newAnnouncementInCart)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

module.exports = { 
    newBuyWithoutCart,
    putAnnouncementInCart
 }