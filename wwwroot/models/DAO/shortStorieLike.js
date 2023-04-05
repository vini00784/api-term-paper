/*
    Objetivo:     API responsible for handling short stories likes data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertShortStorieLike = async (shortStorieLike) => {
    try {
        let sql = `INSERT INTO tbl_curtida_historia_curta (id_historia_curta, id_usuario)
                                                    values (
                                                        ${shortStorieLike.id_historia_curta},
                                                        ${shortStorieLike.id_usuario}
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

const countShortStorieLikes = async (shortStorieId) => {
    
}

const deleteShortStorieLike = async (shortStorieId) => {
    
}

module.exports = {
    insertShortStorieLike
}