/*
    Objetivo:     API responsible for handling user data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertUser = async (user) => {
    try {
        let sql = `INSERT INTO tbl_usuario (
                                            user_name,
                                            nome,
                                            data_nascimento,
                                            foto,
                                            biografia,
                                            email,
                                            premium,
                                            uid)
                                            values (
                                                LOWER('${user.user_name}'),
                                                '${user.nome}',
                                                '${user.data_nascimento}',
                                                '${user.foto}',
                                                '${user.biografia}',
                                                '${user.email}',
                                                '${user.premium}',
                                                '${user.uid}'
                                            )`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result) {
            let sqlLastId = 'SELECT max(id) FROM tbl_usuario'

            const result = await prisma.$queryRawUnsafe(sqlLastId)

            if(result)
                return result

            return result
        }
        else
            return false

    } catch(err) {
        console.log(err)
    }
}

const updateUser = async (user, genresId) => {
    try {
        let sql = `call proc_update_dados_usuario (${user.id}, '${user.user_name}', '${user.nome}', '${user.foto}', '${user.biografia}', ${user.premium}, ${user.id_tag_1}, ${user.id_tag_2}, '${genresId}')`

        const result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true
        else
            return false

    } catch (err) {
        console.log(err)
    }
}

const updateUserPassword = async (user) => {
    try {
        let sql = `UPDATE tbl_usuario SET
                   senha = md5('${user.senha}')
                   WHERE id = ${user.id}`
        

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false

    } catch (err) {
        console.log(err)
    }
}

const deleteUser = async (id) => {
    try {
        let sql = `DELETE FROM tbl_usuario WHERE id = ${id}`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectUserByUsername = async (userName) => {
    try {
        let sql = `SELECT cast(tbl_usuario.id AS decimal) AS id, tbl_usuario.user_name, tbl_usuario.nome, tbl_usuario.data_nascimento, tbl_usuario.foto, tbl_usuario.biografia, tbl_usuario.email, tbl_usuario.premium
        FROM tbl_usuario_tag
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_usuario_tag.id_usuario
        INNER JOIN tbl_tag
           ON tbl_tag.id = tbl_usuario_tag.id_tag
     
        WHERE (LOCATE('${userName}', tbl_usuario.user_name) OR LOCATE('${userName}', tbl_usuario.nome)) AND tbl_usuario_tag.id_tag = 1`
        
        const rsUserByUsername = await prisma.$queryRawUnsafe(sql)

        if(rsUserByUsername)
            return rsUserByUsername
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectAllUsers = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) AS id, user_name, nome, data_nascimento, foto, biografia, email, premium, uid FROM tbl_usuario ORDER BY id DESC'

        const rsUsers = await prisma.$queryRawUnsafe(sql)

        if(rsUsers.length > 0)
            return rsUsers
        else
            return false
    } catch(err) {
        console.log(err)
    }
}

const login = async (userUID) => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id, uid FROM tbl_usuario WHERE uid = '${userUID}'`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch(err) {
        console.log(err)
    }
}

const selectUserByID = async (userId) => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id, user_name, nome, data_nascimento, foto, biografia, email, premium FROM tbl_usuario WHERE id = ${userId}`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch(err) {
        console.log(err)
    }
}

const verifyUserName = async (userName) => {
    try {
        let sql = `SELECT id FROM tbl_usuario WHERE user_name LIKE '${userName}'`

        const rsId = await prisma.$queryRawUnsafe(sql)

        if(rsId.length > 0)
            return rsId
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectLastId = async () => {
    try {
        let sql = 'SELECT cast(id AS decimal) AS id FROM tbl_usuario ORDER BY id DESC LIMIT 1'

        const rsLastId = await prisma.$queryRawUnsafe(sql)

        if(rsLastId)
            return rsLastId[0].id
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countUserWorks = async (userId) => {
    try {
        let sql = `SELECT cast(COUNT(id) AS DECIMAL) AS total_obras
        FROM (
           SELECT id FROM tbl_historia_curta WHERE id_usuario = ${userId}
           UNION ALL
           SELECT id FROM tbl_anuncio WHERE id_usuario = ${userId}
        ) AS tbl_total_obras`

        const rsWorks = await prisma.$queryRawUnsafe(sql)

        if(rsWorks.length > 0)
            return rsWorks[0]
    } catch (err) {
        console.log(err)
    }
}

const selectUserByRecommendation = async (recommendationId) => {
    try {
        let sql = `SELECT tbl_usuario.user_name, tbl_usuario.nome, tbl_usuario.foto
        FROM tbl_recomendacao
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_recomendacao.id_usuario
     
        WHERE tbl_recomendacao.id = ${recommendationId}`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    selectUserByUsername,
    selectAllUsers,
    login,
    selectUserByID,
    verifyUserName,
    selectLastId,
    countUserWorks,
    selectUserByRecommendation
}