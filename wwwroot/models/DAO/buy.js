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
        let sql = `CALL proc_buy_now (${buy.id_anuncio}, ${buy.id_usuario})`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const insertAnnouncementInCart = async (cart) => {
    try {
        let sql = `INSERT INTO tbl_carrinho (id_anuncio, id_usuario, status) values (
            ${cart.id_anuncio},
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

const selectCartItems = async (userId) => {
    try {
        let sql = `SELECT tbl_anuncio.titulo, tbl_anuncio.capa, tbl_anuncio.preco
        FROM tbl_carrinho
     
        INNER JOIN tbl_anuncio
           ON tbl_anuncio.id = tbl_carrinho.id_anuncio
        
        WHERE tbl_carrinho.id_usuario = ${userId}`

        const rsCartItems = await prisma.$queryRawUnsafe(sql)

        if(rsCartItems.length > 0)
            return rsCartItems
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    insertBuyWithoutCart,
    insertAnnouncementInCart,
    selectCartItems
 }