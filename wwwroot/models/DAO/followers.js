/*
    Objetivo:     API responsible for handling announcements (of books) data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/05/2023
    Versão:       1.0
*/

// Instance of the PrismaClient class
const prisma = require('../../libs/prisma.js')

const insertFollower = async (follow) => { // EndPoint to follow user
    try {
        let sql = `INSERT INTO tbl_seguidor_seguidores (id_segue, id_seguidor) values (
            ${follow.id_segue},
            ${follow.id_seguindo}
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

const deleteFollow = async (followerId, followedId) => {
    try {
        let sql = `DELETE FROM tbl_seguidor_seguidores WHERE id_segue = ${followerId} AND id_seguidor = ${followedId}`

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
    insertFollower,
    deleteFollow
}