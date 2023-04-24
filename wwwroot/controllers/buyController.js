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

const listCartItems = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const cartItems = await buyModel.selectCartItems(userId)

        if(cartItems) {
            let cartItemsJson = {}
            cartItemsJson = cartItems

            return { status: 200, message: cartItemsJson }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

const deleteCartItem = async (announcementId, userId) => {
    if(announcementId == '' || announcementId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const deletedCartItem = await buyModel.deleteCartItem(announcementId, userId)

        if(deletedCartItem)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const verifyCartItem = async (announcementId, userId) => {
    if(announcementId == '' || announcementId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedCartItem = await buyModel.verifyCartItem(announcementId, userId)

        if(verifiedCartItem)
            return { status: 200, message: true }
        else
            return {status: 404, message: false}
    }
}

const confirmBuy = async (cart) => {
    if(cart.id_carrinho == '' || cart.id_carrinho == undefined || cart.id_usuario == '' || cart.id_usuario == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        let userCartArrayLength = cart.id_carrinho.length
        
        let confirmBuyJson = {}
        confirmBuyJson.id_usuario = cart.id_usuario
        let confirmedBuy
        for(let i = 0; i < userCartArrayLength; i++) {
            confirmBuyJson.id_carrinho = cart.id_carrinho[i].id
            confirmedBuy = await buyModel.confirmBuy(confirmBuyJson)
            await buyModel.updateCartStatus(cart.id_carrinho[i].id)
            console.log(cart.id_carrinho[i].id);
        }
            
        if(confirmedBuy)
            return { status: 200, message: MESSAGE_SUCCESS.BUY_SUCCESS }
        else
            return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
        

    }
}

module.exports = { 
    newBuyWithoutCart,
    putAnnouncementInCart,
    listCartItems,
    deleteCartItem,
    verifyCartItem,
    confirmBuy
 }