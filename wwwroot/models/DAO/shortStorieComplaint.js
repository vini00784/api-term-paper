/*
    Objetivo:     API responsible for handling short storie complaints data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 10/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const { prisma } = require('../../libs/prisma.js')

const insertShortStorieComplaint = async (shortStorieComplaint) => {
    try {
        let sql = `INSERT INTO tbl_denuncia_historia_curta (descricao, id_historia_curta) values (
            '${shortStorieComplaint.descricao}',
            ${shortStorieComplaint.id_historia_curta}
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

const insertShortStorieComplaintType = async (shortStorieComplaintType) => {
    try {
        let sql = `INSERT INTO tbl_tipo_denuncia_denuncia_historia_curta (id_denuncia_historia_curta, id_tipo_denuncia) values (
            ${shortStorieComplaintType.id_denuncia_historia_curta},
            ${shortStorieComplaintType.id_tipo_denuncia}
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

const selectLastShortStorieComplaintId = async () => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id FROM tbl_denuncia_historia_curta ORDER BY id DESC LIMIT 1`

        const rsId = await prisma.$queryRawUnsafe(sql)

        if(rsId.length > 0)
            return rsId[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteShortStorieComplaint = async (shortStorieComplaintId) => {
    try {
        let sql = `DELETE FROM tbl_denuncia_historia_curta WHERE id = ${shortStorieComplaintId}`

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
    insertShortStorieComplaint,
    insertShortStorieComplaintType,
    selectLastShortStorieComplaintId,
    deleteShortStorieComplaint
}