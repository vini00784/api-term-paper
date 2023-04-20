/*
    Objetivo:     API responsible for handling user_tag data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertUserTag = async (userTag) => {
    try {
        let sql = `INSERT INTO tbl_usuario_tag (id_usuario, id_tag)
                                            values (
                                                ${userTag.id_usuario},
                                                ${userTag.id_tag}
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
    insertUserTag
}