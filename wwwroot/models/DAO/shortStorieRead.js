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
    
}

module.exports = {
    insertShortStorieRead,
    countShortStorieReads
}