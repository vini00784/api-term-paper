/*
    Objetivo:     API responsible for handling genre (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 24/02/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const selectAllGenres = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) as id, nome FROM tbl_generos ORDER BY nome ASC'

        const rsGenres = await prisma.$queryRawUnsafe(sql)

        if(rsGenres)
            return rsGenres
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    selectAllGenres
}