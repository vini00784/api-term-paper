/*
    Objetivo:     API responsible for handling user_genre data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/03/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertUserGenre = async (userGenre) => {
    try {
        let sql = `INSERT INTO tbl_usuario_genero (id_usuario, id_generos)
                                            values (
                                                ${userGenre.id_usuario},
                                                ${userGenre.id_generos}
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
    insertUserGenre
}