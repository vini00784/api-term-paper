/*
    Objetivo:     API responsible for handling short stories favorites data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 06/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertShortStorieFavorite = async (shortStorieFavorite) => {
    try {
        let sql = `INSERT INTO tbl_favorito_historia_curta (id_historia_curta, id_usuario)
                                                    values (
                                                        ${shortStorieFavorite.id_historia_curta},
                                                        ${shortStorieFavorite.id_usuario}
                                                    )`

        const result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countShortStorieFavorites = async (shortStorieId) => {
    
}

const deleteShortStorieFavorite = async (shortStorieFavorite) => {
    
}

module.exports = {
    insertShortStorieFavorite
}