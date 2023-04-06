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
    try {
        let sql = `SELECT id_historia_curta, cast(COUNT(id) AS DECIMAL) as quantidade_curtidas FROM tbl_curtida_historia_curta WHERE id_historia_curta = ${shortStorieId}`

        const rsLikes = await prisma.$queryRawUnsafe(sql)

        if(rsLikes.length > 0)
            return rsLikes[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorieLike = async (shortStorieLike) => {
    try {
        let sql = `DELETE FROM tbl_curtida_historia_curta WHERE id_historia_curta = ${shortStorieLike.id_historia_curta} AND id_usuario = ${shortStorieLike.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorieLike,
    countShortStorieLikes,
    deleteShortStorieLike
}