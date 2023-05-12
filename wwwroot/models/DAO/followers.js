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

const selectUserFollowers = async (userId) => { // EndPoint to get user followers
    try {
        let sql = `SELECT tbl_usuario.id, tbl_usuario.foto, tbl_usuario.nome, tbl_usuario.user_name
        FROM tbl_seguidor_seguidores
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_seguidor_seguidores.id_segue
     
        WHERE tbl_seguidor_seguidores.id_seguidor = ${userId}`

        const rsFollowers = await prisma.$queryRawUnsafe(sql)

        if(rsFollowers.length > 0)
            return rsFollowers
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const selectFollowingUsers = async (userId) => {
    try {
        let sql = `SELECT tbl_usuario.id, tbl_usuario.foto, tbl_usuario.nome, tbl_usuario.user_name
        FROM tbl_seguidor_seguidores
     
        INNER JOIN tbl_usuario
           ON tbl_usuario.id = tbl_seguidor_seguidores.id_seguidor
     
        WHERE tbl_seguidor_seguidores.id_segue = ${userId}`

        const rsFollowingUsers = await prisma.$queryRawUnsafe(sql)

        if(rsFollowingUsers.length > 0)
            return rsFollowingUsers
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyUserFollow = async (followerId, followingId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_seguidor_seguidores WHERE id_segue = ${followerId} AND id_seguidor = ${followingId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const verifyUserFollowing = async (followerId, followingId) => {
    try {
        let sql = `SELECT cast(id AS DECIMAL) AS id FROM tbl_seguidor_seguidores WHERE id_seguidor = ${followerId} AND id_segue = ${followingId}`

        const rsResult = await prisma.$queryRawUnsafe(sql)

        if(rsResult.length > 0)
            return true
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countUserFollowers = async (userId) => {
    try {
        let sql = `SELECT cast(COUNT(id) AS DECIMAL) AS quantidade_seguidores FROM tbl_seguidor_seguidores WHERE id_seguidor = ${userId}`

        const rsFollowers = await prisma.$queryRawUnsafe(sql)

        if(rsFollowers.length > 0)
            return rsFollowers[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

const countUserFollowing = async (userId) => {
    try {
        let sql = `SELECT cast(COUNT(id) AS DECIMAL) AS quantidade_seguindo FROM tbl_seguidor_seguidores WHERE id_segue = ${userId}`

        const rsFollowing = await prisma.$queryRawUnsafe(sql)

        if(rsFollowing.length > 0)
            return rsFollowing[0]
        else
            return false
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertFollower,
    deleteFollow,
    selectUserFollowers,
    selectFollowingUsers,
    verifyUserFollow,
    verifyUserFollowing,
    countUserFollowers,
    countUserFollowing
}