/*
    Objetivo:     API responsible for handling recommendations (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 12/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertRecommendation = async (recommendation) => {
    try {
        let sql = `INSERT INTO tbl_recomendacao (conteudo, data_hora, id_usuario, id_anuncio) values (
            '${recommendation.conteudo}',
            '${recommendation.data_publicado}',
            ${recommendation.id_usuario},
            ${recommendation.id_anuncio}
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

module.exports = {
    insertRecommendation
}