/*
    Objetivo:     API responsible for handling short stories Reads data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 05/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertShortStorieRead = async (shortStorieRead) => {
    try {
        let sql = `INSERT INTO tbl_quantidade_lidos_historia_curta (id_historia_curta, id_usuario)
                                                    values (
                                                        ${shortStorieRead.id_historia_curta},
                                                        ${shortStorieRead.id_usuario}
                                                    )`

        const result = await prisma.$executeRawUnsafe(sql)
        console.log(result)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countShortStorieReads = async (shortStorieId) => {
    try {
        let sql = `SELECT id_historia_curta, cast(COUNT(id) AS DECIMAL) as quantidade_lidos FROM tbl_quantidade_lidos_historia_curta WHERE id_historia_curta = ${shortStorieId}`

        const rsReads = await prisma.$queryRawUnsafe(sql)

        if(rsReads.length > 0)
            return rsReads[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorieRead = async (shortStorieRead) => {
    try {
        let sql = `DELETE FROM tbl_quantidade_lidos_historia_curta WHERE id_historia_curta = ${shortStorieRead.id_historia_curta} AND id_usuario = ${shortStorieRead.id_usuario}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyShortStorieRead = async (shortStorieID, userID) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_quantidade_lidos_historia_curta WHERE id_historia_curta = ${shortStorieID} AND id_usuario = ${userID}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectReadedShortStories = async (userId) => {
    try {
        let sql = `SELECT cast(tbl_historia_curta.id AS DECIMAL) as id, tbl_historia_curta.titulo, tbl_historia_curta.sinopse, tbl_historia_curta.capa, tbl_historia_curta.status, tbl_historia_curta.historia, tbl_historia_curta.data, tbl_historia_curta.premium
        FROM tbl_quantidade_lidos_historia_curta
     
        INNER JOIN tbl_historia_curta
           ON tbl_historia_curta.id = tbl_quantidade_lidos_historia_curta.id_historia_curta
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_quantidade_lidos_historia_curta.id_usuario
     
        WHERE tbl_quantidade_lidos_historia_curta.id_usuario = ${userId}`

        const rsReadedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsReadedShortStories.length > 0)
            return rsReadedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorieRead,
    countShortStorieReads,
    deleteShortStorieRead,
    verifyShortStorieRead,
    selectReadedShortStories
}