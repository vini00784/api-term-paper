/*
    Objetivo:     API responsible for handling buys data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 19/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
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
        let sql = `SELECT cast(tbl_anuncio.id AS DECIMAL) AS id_anuncio, tbl_anuncio.titulo, tbl_anuncio.capa, tbl_anuncio.preco, tbl_anuncio.pdf, tbl_anuncio.epub, tbl_anuncio.mobi
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
        let sql = `SELECT SUM(cast(tbl_anuncio.preco AS DECIMAL)) as total
        FROM tbl_compra

        INNER JOIN tbl_anuncio
            ON tbl_anuncio.id = tbl_compra.id_anuncio

        WHERE tbl_compra.id_carrinho = ${cartId}`

        const rsTotalPrice = await prisma.$queryRawUnsafe(sql)

        if(rsTotalPrice.length > 0)
            return rsTotalPrice[0].total
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteCartItem = async (announcementId, userId) => {
    try {
        let sql = `DELETE FROM tbl_carrinho WHERE id_anuncio = ${announcementId} AND id_usuario = ${userId}`

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
    verifyUserBuy
 }