/*
    Objetivo:     API responsible for handling user complaints data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 10/04/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const prisma = require('../../libs/prisma.js')

const insertUserComplaint = async (userComplaint) => {
    try {
        let sql = `INSERT INTO tbl_denuncia_usuario (descricao, id_usuario) values (
            '${userComplaint.descricao}',
            ${userComplaint.id_usuario}
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

const insertUserComplaintType = async (userComplaintType) => {
    try {
        let sql = `INSERT INTO tbl_tipo_denuncia_denuncia_usuario (id_denuncia, id_tipo_denuncia) values (
            ${userComplaintType.id_denuncia},
            ${userComplaintType.id_tipo_denuncia}
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

const selectLastUserComplaintId = async () => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id FROM tbl_denuncia_usuario ORDER BY id DESC LIMIT 1`

        const rsId = await prisma.$queryRawUnsafe(sql)

        if(rsId.length > 0)
            return rsId[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteUserComplaint = async (userComplaintId) => {
    try {
        let sql = `DELETE FROM tbl_denuncia_usuario WHERE id = ${userComplaintId}`

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
    insertUserComplaint,
    insertUserComplaintType,
    selectLastUserComplaintId,
    deleteUserComplaint
}