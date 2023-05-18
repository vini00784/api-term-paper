/*
    Objetivo:     API responsible for handling buys data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 19/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const { filterAnnouncementsByGenresPrice } = require('../../controllers/announcementController.js')
const prisma = require('../../libs/prisma.js')

const insertBuyWithoutCart = async (buy) => {
    try {
        let sql = `CALL proc_buy_now (${buy.id_usuario}, ${buy.id_anuncio})`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertCart = async (cart) => {
    try {
        let sql = `INSERT INTO tbl_carrinho (id_usuario, status) values (
            ${cart.id_usuario},
            ${cart.status}
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

const insertItemInCart = async (cart) => {
    try {
        let sql = `INSERT INTO tbl_compra (id_carrinho, id_anuncio) values (
            ${cart.id_carrinho},
            ${cart.id_anuncio}
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

const selectCartItems = async (cartId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) AS id_anuncio, tbl_anuncio.titulo, tbl_anuncio.sinopse, tbl_anuncio.capa, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_compra

        INNER JOIN tbl_anuncio
            ON tbl_anuncio.id = tbl_compra.id_anuncio
        WHERE tbl_compra.id_carrinho = ${cartId}`

        const rsCartItems = await prisma.$queryRawUnsafe(sql)

        if(rsCartItems.length > 0)
            return rsCartItems
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const totalPriceCart = async (cartId) => {
    try {
        let sql = `SELECT FORMAT(SUM(tbl_anuncio.preco), 2) AS total
        FROM tbl_compra

        INNER JOIN tbl_anuncio
            ON tbl_anuncio.id = tbl_compra.id_anuncio

        WHERE tbl_compra.id_carrinho = ${cartId};`

        const rsTotalPrice = await prisma.$queryRawUnsafe(sql)

        if(rsTotalPrice.length > 0)
            return rsTotalPrice[0].total
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteCartItem = async (announcementId, cartId) => {
    try {
        let sql = `DELETE FROM tbl_compra WHERE id_anuncio = ${announcementId} AND id_carrinho = ${cartId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyCart = async (userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_carrinho WHERE id_usuario = ${userId} AND status = false ORDER BY id DESC LIMIT 1`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectLastCart = async (userId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_carrinho WHERE id_usuario = ${userId} AND status = false ORDER BY id DESC LIMIT 1`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return rsResult[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const confirmBuy = async (cart) => {
    try {
        let sql = `INSERT INTO tbl_livros_comprados (id_usuario, id_anuncio) values (
            ${cart.id_usuario},
            ${cart.id_anuncio}
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

const updateCartStatus = async (cartId) => {
    try {
        let sql = `UPDATE tbl_carrinho SET status = true WHERE id = ${cartId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectItemsIdsFromCart = async (cartId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) AS id
        FROM tbl_compra
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_compra.id_anuncio
        WHERE tbl_compra.id_carrinho = ${cartId}`

        const rsIds = await prisma.$queryRawUnsafe(sql)

        if(rsIds.length > 0)
            return rsIds
        else
            return false
    } catch (err) {
        console.log(err);
    }
}

const verifyUserBuy = async (announcementID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_livros_comprados WHERE id_anuncio = ${announcementID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyUserCart = async (announcementID, userID) => {
    try {
        let sql = `SELECT cast(tbl_compra.id_anuncio AS DECIMAL) AS id
        FROM tbl_carrinho
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_carrinho.id_usuario

        INNER JOIN tbl_compra
            ON tbl_carrinho.id = tbl_compra.id_carrinho

        WHERE tbl_compra.id_anuncio = ${announcementID} AND tbl_carrinho.id_usuario = ${userID} AND tbl_carrinho.status = false`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countAnnouncementPurchases = async (announcementId) => {
    try {
        let sql = `SELECT id_anuncio, cast(COUNT(id) AS DECIMAL) AS quantidade_compras FROM tbl_livros_comprados WHERE id_anuncio = ${announcementId}`

        const rsPurchases = await prisma.$queryRawUnsafe(sql)

        if(rsPurchases.length > 0)
            return rsPurchases[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectPurchasedAnnouncements = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) as id, tbl_anuncio.titulo, tbl_anuncio.volume, tbl_anuncio.capa, tbl_anuncio.status, tbl_anuncio.premium, tbl_anuncio.sinopse, tbl_anuncio.data, tbl_anuncio.quantidade_paginas, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
        FROM tbl_livros_comprados
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_livros_comprados.id_anuncio
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_livros_comprados.id_usuario
     
        WHERE tbl_livros_comprados.id_usuario = ${userId}`

        const rsPurchasedAnnouncements = await prisma.$queryRawUnsafe(sql)

        if(rsPurchasedAnnouncements.length > 0)
            return rsPurchasedAnnouncements
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertPaymentStripeId = async (cartId, paymentStripeId) => {
    try {
        let sql = `UPDATE tbl_carrinho SET 
        id_pagamento_stripe = '${paymentStripeId}' 
        WHERE id = ${cartId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectCartByStripeId = async (paymentStripeId) => {
    try {
        let sql = `SELECT * FROM tbl_carrinho WHERE id_pagamento_stripe = '${paymentStripeId}'`

        const rsCartByStripe = await prisma.$queryRawUnsafe(sql)

        if(rsCartByStripe.length > 0)
            return rsCartByStripe
        else
            return false
    } catch (error) {
        
    }
}

module.exports = { 
    insertBuyWithoutCart,
    insertCart,
    insertItemInCart,
    selectCartItems,
    deleteCartItem,
    verifyCart,
    selectLastCart,
    confirmBuy,
    updateCartStatus,
    selectItemsIdsFromCart,
    totalPriceCart,
    verifyUserBuy,
    verifyUserCart,
    countAnnouncementPurchases,
    selectPurchasedAnnouncements,
    insertPaymentStripeId,
    selectCartByStripeId
 }