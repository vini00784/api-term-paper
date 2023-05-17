/*
    Objetivo:     API responsible for handling recommendations complaints data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertRecommendationComplaint = async (recommendationComplaint) => {
    try {
        let sql = `INSERT INTO tbl_denuncia_recomendacao (descricao, id_recomendacao, id_denunciador) values (
            '${recommendationComplaint.descricao}',
            ${recommendationComplaint.id_recomendacao},
            ${recommendationComplaint.id_denunciador}
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

const insertRecommendationComplaintType = async (recommendationComplaintType) => {
    try {
        let sql = `INSERT INTO tbl_tipo_denuncia_denuncia_recomendacao (id_denuncia_recomendacao, id_tipo_denuncia) values (
            ${recommendationComplaintType.id_denuncia},
            ${recommendationComplaintType.id_tipo_denuncia}
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

const selectLastRecommendationComplaintId = async () => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id FROM tbl_denuncia_recomendacao ORDER BY id DESC LIMIT 1`

        const rsId = await prisma.$queryRawUnsafe(sql)

        if(rsId.length > 0)
            return rsId[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const deleteRecommendationComplaint = async (recommendationId) => {
    try {
        let sql = `DELETE FROM tbl_denuncia_recomendacao WHERE id = ${recommendationId}`

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
    insertRecommendationComplaint,
    insertRecommendationComplaintType,
    selectLastRecommendationComplaintId,
    deleteRecommendationComplaint
}