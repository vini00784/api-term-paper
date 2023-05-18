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

// Function to destructure announcement json
const { destructureAnnouncementJson, verifyAnnouncementLikeFavoriteRead} = require('../utils/destructureJson.js')

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

const createCart = async (cart, userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifyUserCart = await verifyCart(userId)

        if(!verifyUserCart) {
            cart.status = 0
            cart.id_usuario = userId
    
            const newAnnouncementInCart = await buyModel.insertCart(cart)
    
            if(newAnnouncementInCart)
                return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
            else
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
        } else
            return { status: 400, message: MESSAGE_ERROR.ALREADY_EXISTS_CART }
    }
}

const insertItemCart = async (cart, userId) => {
    if(cart.id_anuncio == '' || cart.id_anuncio == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        let lastUserCart = await buyModel.selectLastCart(userId)

        if(lastUserCart) {
            cart.id_carrinho = lastUserCart
            let userCartArrayLength = cart.id_anuncio.length
            
            let cartsItem = {}
            cartsItem.id_carrinho = lastUserCart
            let confirmedBuy
            for(let i = 0; i < userCartArrayLength; i++) {
                cartsItem.id_anuncio = cart.id_anuncio[i].id
                confirmedBuy = await buyModel.insertItemInCart(cartsItem)
            }
    
            if(confirmedBuy)
                return { status: 200, message: MESSAGE_SUCCESS.INSERT_CART_ITEM }
            else 
                return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
        } else {
            const confirmedBuy = await insertItemCartFun(cart, userId)

            if(confirmedBuy)
                return { status: 200, message: MESSAGE_SUCCESS.INSERT_CART_ITEM }
            else
                return { status: 400, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
        }
    }
}

const listCartItems = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const lastUserCart = await buyModel.selectLastCart(userId)

        if(lastUserCart) {
            const cartItems = await buyModel.selectCartItems(lastUserCart)
            const totalPrice = await buyModel.totalPriceCart(lastUserCart)
    
            if(cartItems) {
                let cartItemsJson = {}
                cartItemsJson.items = cartItems
                cartItemsJson.total = parseFloat(totalPrice)
    
                return { status: 200, message: cartItemsJson }
            } else
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
        } else {
            const cartItems = await listCartItemsFun(userId)

            return { status: cartItems.status, message: cartItems.message }
        }
    }
}

const newStripePaymentId = async (userId, paymentStripeId) => {
    if(paymentStripeId == ''|| paymentStripeId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const lastUserCart = await buyModel.selectLastCart(userId)

        const insertStripePaymentId = await buyModel.insertPaymentStripeId(lastUserCart, paymentStripeId)

        if(insertStripePaymentId)
            return true
        else
            return false
    }
}

const deleteCartItem = async (announcementId, userId) => {
    if(announcementId == '' || announcementId == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const lastUserCart = await buyModel.selectLastCart(userId)
        const deletedCartItem = await buyModel.deleteCartItem(announcementId, lastUserCart)

        if(deletedCartItem)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

const verifyCart = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedCartItem = await buyModel.verifyCart(userId)

        if(verifiedCartItem)
            return true
        else
            return false
    }
}

const confirmBuy = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const lastUserCart = await buyModel.selectLastCart(userId)

        if(lastUserCart) {
            const announcementsIds = await buyModel.selectItemsIdsFromCart(lastUserCart)

            if(announcementsIds) {
                const announcementsIdsLength = announcementsIds.length
        
                let confirmedBuy
                let boughtBookJson = {}
                boughtBookJson.id_usuario = userId
        
                for(let i = 0; i < announcementsIdsLength; i++) {
                    boughtBookJson.id_anuncio = announcementsIds[i].id
                    confirmedBuy = await buyModel.confirmBuy(boughtBookJson)
                }
        
                if(confirmedBuy) {
                    await buyModel.updateCartStatus(lastUserCart)
                    return { status: 200, message: MESSAGE_SUCCESS.BUY_SUCCESS }
                } else
                    return { status: 400, message: '' }
        
            } else
                return { status: 400, message: MESSAGE_ERROR.EMPTY_CART }
        } else {
            const confirmedBuy = await confirmBuyFun(userId)

            return { status: confirmedBuy.status, message: confirmedBuy.message }
        }

    }
}

const insertItemCartFun = async (cart, userId) => {
    await createCart(cart, userId)
    let lastUserCart = await buyModel.selectLastCart(userId)

    cart.id_carrinho = lastUserCart
    let userCartArrayLength = cart.id_anuncio.length
            
    let cartsItem = {}
    cartsItem.id_carrinho = lastUserCart
    let confirmedBuy
    for(let i = 0; i < userCartArrayLength; i++) {
        cartsItem.id_anuncio = cart.id_anuncio[i].id
        confirmedBuy = await buyModel.insertItemInCart(cartsItem)
    }
    
    if(confirmedBuy)
        return true
    else 
        return false
}

const listCartItemsFun = async (userId) => {
    await createCart(
        {
            id_usuario: userId,
            status: 0
        }, 
        userId
    )
    const lastUserCart = await buyModel.selectLastCart(userId)
    const cartItems = await buyModel.selectCartItems(lastUserCart)
    const totalPrice = await buyModel.totalPriceCart(lastUserCart)
    
    if(cartItems) {
        let cartItemsJson = {}
        cartItemsJson.items = cartItems
        cartItemsJson.total = parseFloat(totalPrice)
    
        return { status: 200, message: cartItemsJson }
    } else
        return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

const confirmBuyFun = async (userId) => {
    await createCart(
        {
            id_usuario: userId,
            status: 0
        }, 
        userId
    )

    const lastUserCart = await buyModel.selectLastCart(userId)
    const announcementsIds = await buyModel.selectItemsIdsFromCart(lastUserCart)

    if(announcementsIds) {
        const announcementsIdsLength = announcementsIds.length
        
        let confirmedBuy
        let boughtBookJson = {}
        boughtBookJson.id_usuario = userId
        
        for(let i = 0; i < announcementsIdsLength; i++) {
            boughtBookJson.id_anuncio = announcementsIds[i].id
            confirmedBuy = await buyModel.confirmBuy(boughtBookJson)
        }
        
        if(confirmedBuy) {
            await buyModel.updateCartStatus(lastUserCart)
            return { status: 200, message: MESSAGE_SUCCESS.BUY_SUCCESS }
        } else
            return { status: 400, message: '' }
        
    } else
        return { status: 400, message: MESSAGE_ERROR.EMPTY_CART }
}

const verifyUserBuy = async (announcementID, userId) => {
    if(announcementID == '' || announcementID == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedUserBuy = await buyModel.verifyUserBuy(announcementID, userId)

        if(verifiedUserBuy)
            return true
        else
            return false
    }
}

const verifyUserCart = async (announcementID, userId) => {
    if(announcementID == '' || announcementID == undefined || userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const verifiedUserBuy = await buyModel.verifyUserCart(announcementID, userId)

        if(verifiedUserBuy)
            return true
        else
            return false
    }
}

const countAnnouncementPurchases = async (announcementId) => {
    if(announcementId == '' || announcementId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_ID }
    else {
        const announcementPurchases = await buyModel.countAnnouncementPurchases(announcementId)

        if(announcementPurchases) {
            let purchasesJson = {}
            purchasesJson = announcementPurchases

            if(purchasesJson.id_anuncio == null || purchasesJson.id_anuncio == undefined)
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
            else
                return { status: 200, message: purchasesJson }
        }
    }
}

const listPurchasedAnnouncements = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const purchasedAnnouncementsData = await buyModel.selectPurchasedAnnouncements(userId)
        if(purchasedAnnouncementsData) {
            let filteredJson = purchasedAnnouncementsData.filter((element, index, self) => index === self.findIndex((t => (
                parseInt(t.id) === parseInt(element.id)
            ))))
    
            await verifyAnnouncementLikeFavoriteRead(filteredJson, userId)
    
            if(filteredJson) {
                let purchasedAnnouncements = {}
    
                const announcementDataArray = await destructureAnnouncementJson(filteredJson)
    
                purchasedAnnouncements = await Promise.all(announcementDataArray)
                return { status: 200, message: purchasedAnnouncements }
            } else
                return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
        } else
            return { status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }
}

module.exports = { 
    newBuyWithoutCart,
    createCart,
    insertItemCart,
    listCartItems,
    newStripePaymentId,
    deleteCartItem,
    verifyCart,
    confirmBuy,
    verifyUserBuy,
    verifyUserCart,
    countAnnouncementPurchases,
    listPurchasedAnnouncements
 }