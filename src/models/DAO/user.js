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

module.exports = {
    insertUser
}