/*
    Objetivo:     API responsible for handling buys data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 19/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

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

module.exports = { insertBuyWithoutCart }