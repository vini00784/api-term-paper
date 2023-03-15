/*
    Objetivo:     API responsible for handling user data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

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
                                            senha)
                                            values (
                                                LOWER('${user.user_name}'),
                                                '${user.nome}',
                                                '${user.data_nascimento}',
                                                '${user.foto}',
                                                '${user.biografia}',
                                                '${user.email}',
                                                '${user.premium}',
                                                md5('${user.senha}')
                                            );
                                            SELECT LAST_INSERT_ID()`

        const result = await prisma.$queryRawUnsafe(sql)
        console.log(result)

        if(result)
            return result
        else
            return false

    } catch(err) {
        console.log(err)
    }
}

const updateUser = async (user, genresId) => {
    try {
        let sql = `call proc_update_dados_usuario (${user.id}, '${user.user_name}', '${user.nome}', '${user.data_nascimento}', '${user.foto}', '${user.biografia}', '${user.email}', ${user.premium}, ${user.id_tag_1}, ${user.id_tag_2}, '${genresId}')`

        const result = await prisma.$executeRawUnsafe(sql)

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
        let sql = `SELECT cast(id AS decimal) AS id, user_name, nome, data_nascimento, foto, biografia, email, premium FROM tbl_usuario WHERE user_name = '${userName}'`

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
        let sql = 'SELECT cast(id AS decimal) AS id, user_name, nome, data_nascimento, foto, biografia, email, premium, md5(senha) as senha FROM tbl_usuario ORDER BY id DESC'

        const rsUsers = await prisma.$queryRawUnsafe(sql)

        if(rsUsers.length > 0)
            return rsUsers
        else
            return false
    } catch(err) {
        console.log(err)
    }
}

const login = async (userLogin, userPassword) => {
    try {
        let sql = `SELECT cast(id AS decimal) AS id, user_name, md5(senha) as senha FROM tbl_usuario WHERE (user_name = '${userLogin}' OR email = '${userLogin}') AND senha = md5('${userPassword}')`

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
    selectLastId
}