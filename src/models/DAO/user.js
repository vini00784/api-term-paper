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
                                                '${user.user_name}',
                                                '${user.nome}',
                                                '${user.data_nascimento}',
                                                '${user.foto}',
                                                '${user.biografia}',
                                                '${user.email}',
                                                '${user.premium}',
                                                md5('${user.senha}')
                                            )`

        const result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false

    } catch(err) {
        console.log(err)
    }
}

const updateUser = async (user) => {

}

const deleteUser = async (id) => {

}

const selectUserByUsername = async (username) => {

}

const selectAllUsers = async () => {
    try {
        let sql = 'SELECT id, user_name, nome, data_nascimento, foto, biografia, email, premium, md5(senha) as senha FROM tbl_usuario ORDER BY id DESC'

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
        let sql = `SELECT id, user_name, md5(senha) as senha FROM tbl_usuario WHERE user_name = '${userLogin}' AND senha = md5('${userPassword}')`

        const rsUser = await prisma.$queryRawUnsafe(sql)

        if(rsUser.length > 0)
            return rsUser
        else
            return false
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    insertUser,
    login,
    selectAllUsers
}