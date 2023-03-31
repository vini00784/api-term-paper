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

const deleteShortStorie = async (shortStorieId) => {
    try {
        let sql = `DELETE FROM tbl_historia_curta WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllShortStories = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium FROM tbl_historia_curta ORDER BY id DESC`

        const rsShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsShortStories)
            return rsShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const desactivateShortStorie = async (shortStorieId) => {
    try {
        let sql = `UPDATE tbl_historia_curta SET status = false WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const activateShortStorie = async (shortStorieId) => {
    try {
        let sql = `UPDATE tbl_historia_curta SET status = true WHERE id = ${shortStorieId}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona apenas o usuário vinculado a tal anúncio
const selectUserByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_usuario.id AS DECIMAL) as id_usuario, tbl_usuario.nome as nome_usuario, tbl_usuario.user_name, tbl_usuario.foto
        FROM tbl_historia_curta
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_historia_curta.id_usuario
     
        WHERE tbl_historia_curta.id = ${shortStorieId}`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectPublicationTypeByShortStorieId = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(tbl_tipo_publicacao.id AS DECIMAL) as id_tipo_publicacao, tbl_tipo_publicacao.tipo
        FROM tbl_historia_curta
     
        INNER JOIN tbl_tipo_publicacao
           ON tbl_tipo_publicacao.id = tbl_historia_curta.id_tipo_publicacao
     
        WHERE tbl_historia_curta.id = ${shortStorieId}`

        const rsPublicationType = await prisma.$queryRawUnsafe(sql)

        if(rsPublicationType.length > 0)
            return rsPublicationType
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectShortStorieById = async (shortStorieId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium FROM tbl_historia_curta WHERE id = ${shortStorieId}`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

// Seleciona todas as histórias curtas referidas a um certo usuário
const selectShortStorieByUserId = async (shortStorieId) => {
    try {
        let sql = `SELECT tbl_historia_curta.id, tbl_historia_curta.titulo
        
        FROM tbl_historia_curta
        
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_historia_curta.id_usuario
         
        WHERE tbl_historia_curta.id_usuario = ${shortStorieId}`

        const rsShortStorie = await prisma.$queryRawUnsafe(sql)

        if(rsShortStorie.length > 0)
            return rsShortStorie
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectActivatedShortStories = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium FROM tbl_historia_curta WHERE status = true ORDER BY id DESC`

        const rsActivatedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsActivatedShortStories.length > 0)
            return rsActivatedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectDesactivatedShortStories = async () => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) as id, titulo, sinopse, capa, status, historia, data, premium FROM tbl_historia_curta WHERE status = false ORDER BY id DESC`

        const rsDesactivatedShortStories = await prisma.$queryRawUnsafe(sql)

        if(rsDesactivatedShortStories.length > 0)
            return rsDesactivatedShortStories
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertShortStorie,
    updateShortStorie,
    deleteShortStorie,
    selectAllShortStories,
    desactivateShortStorie,
    activateShortStorie,
    selectUserByShortStorieId,
    selectPublicationTypeByShortStorieId,
    selectShortStorieById,
    selectShortStorieByUserId,
    selectActivatedShortStories,
    selectDesactivatedShortStories
}