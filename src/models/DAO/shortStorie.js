/*
    Objetivo:     API responsible for handling short stories data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 20/03/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertShortStorie = async (shortStorie, genresId) => {
    try {
        let sql = `CALL proc_insert_historia_curta (
            '${shortStorie.titulo}',
            '${shortStorie.sinopse}',
            '${shortStorie.capa}',
            ${shortStorie.status},
            '${shortStorie.historia}',
            '${shortStorie.data}',
            ${shortStorie.premium},
            ${shortStorie.id_usuario},
            ${shortStorie.id_tipo_publicacao},
            ${shortStorie.id_classificacao},
            '${genresId}'
        )`

        const result = await prisma.$queryRawUnsafe(sql)

        console.log(result)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const updateShortStorie = async (shortStorie, genresId) => {
    try {
        let sql = `CALL proc_update_historia_curta (
            ${shortStorie.id},
            '${shortStorie.titulo}',
            '${shortStorie.sinopse}',
            '${shortStorie.capa}',
            ${shortStorie.status},
            '${shortStorie.historia}',
            '${shortStorie.data}',
            ${shortStorie.premium},
            ${shortStorie.id_usuario},
            ${shortStorie.id_tipo_publicacao},
            ${shortStorie.id_classificacao},
            '${genresId}'
        )`

        // console.log(sql)

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorie,
    updateShortStorie
}