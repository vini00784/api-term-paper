/*
    Objetivo:     API responsible for handling parental ratings (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const selectAllParentalRatings = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) AS id, classificacao, descricao FROM tbl_classificacao_indicativa'

        const rsParentalRatings = await prisma.$queryRawUnsafe(sql)

        if(rsParentalRatings)
            return rsParentalRatings
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    selectAllParentalRatings
}