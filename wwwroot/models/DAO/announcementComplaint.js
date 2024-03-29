/*
    Objetivo:     API responsible for handling announcement complaints data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 10/04/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertAnnouncementComplaint = async (announcementComplaint) => {
    try {
        let sql = `INSERT INTO tbl_denuncia_anuncio (descricao, id_anuncio, id_denunciador) values (
            '${announcementComplaint.descricao}',
            ${announcementComplaint.id_anuncio},
            '${announcementComplaint.id_denunciador}'
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

const insertAnnouncementComplaintType = async (announcementComplaintType) => {
    try {
        let sql = `INSERT INTO tbl_tipo_denuncia_denuncia_anuncio (id_denuncia, id_tipo_denuncia) values (
            ${announcementComplaintType.id_denuncia},
            ${announcementComplaintType.id_tipo_denuncia}
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

const selectLastAnnouncementComplaintId = async () => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id FROM tbl_denuncia_anuncio ORDER BY id DESC LIMIT 1`

        const rsId = await prisma.$queryRawUnsafe(sql)

        if(rsId.length > 0)
            return rsId[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteAnnouncementComplaint = async (announcementComplaintId) => {
    try {
        let sql = `DELETE FROM tbl_denuncia_anuncio WHERE id = ${announcementComplaintId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllComplaintTypes = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id, tipo FROM tbl_tipo_denuncia`

        const rsComplaintTypes = await prisma.$queryRawUnsafe(sql)

        if(rsComplaintTypes.length > 0)
            return rsComplaintTypes
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertAnnouncementComplaint,
    insertAnnouncementComplaintType,
    selectLastAnnouncementComplaintId,
    deleteAnnouncementComplaint,
    selectAllComplaintTypes
}