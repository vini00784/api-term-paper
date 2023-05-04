/*
    Objetivo:     File responsible for handling user data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// User model
const userModel = require('../models/DAO/user.js')

// user_tag model
const userTagModel = require('../models/DAO/userTag.js')

// user_genre model
const userGenreModel = require('../models/DAO/userGenre.js')

// Function to destructure announcement json
const { destructureUserJson, verifyUserFollow } = require('../utils/destructureJson.js')

const newUser = async (user) => {
    if(user.user_name == '' || user.user_name == undefined || user.nome == '' || user.nome == undefined || user.data_nascimento == ''|| user.data_nascimento == undefined || user.email == '' || user.email == undefined || user.uid == ''|| user.uid == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(!user.email.includes('@'))
        return { status: 400, message: MESSAGE_ERROR.INVALID_EMAIL }
    else if(user.user_name.length > 30 || user.nome.length > 200 || user.email.length > 256 || user.uid.length > 100)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        user.premium = 0

        const id = await verifyUserName(user.user_name)

        if(id.length > 0)
            return {status: 400, message: MESSAGE_ERROR.INVALID_USERNAME}
        else {
            const resultNewUser = await userModel.insertUser(user)

            if(resultNewUser) {
                let newUserId = await userModel.selectLastId()

                if(newUserId > 0) {
                    let userTag = {}

                    userTag.id_usuario = newUserId

                    let tagArrayLength = user.tags.length
                    let resultNewUserTag
                    for(let i = 0; i < tagArrayLength; i++) {
                        userTag.id_tag = user.tags[i].id_tag
                        resultNewUserTag = await userTagModel.insertUserTag(userTag)
                    }
                    if(resultNewUserTag) {
                        let userGenre = {}

                        userGenre.id_usuario = newUserId

                        let genreArrayLength = user.generos.length
                        let resultNewUserGenre
                        for(let i = 0; i < genreArrayLength; i++) {
                            userGenre.id_generos = user.generos[i].id_genero
                            resultNewUserGenre = await userGenreModel.insertUserGenre(userGenre)
                        }
                        if(resultNewUserGenre)
                            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                        else {
                            await deleteUser(newUserId)
                            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                        }
                    } else {
                        await deleteUser(newUserId)
                        return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                    }
                } else {
                    await deleteUser(newUserId)
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
                }
            } else
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
        }

    }
}

const updateUser = async (user) => {
    if(user.user_name == '' || user.user_name == undefined || user.nome == '' || user.nome == undefined || user.foto == '' || user.foto == undefined || user.biografia == '' || user.biografia == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(user.user_name.length > 30 || user.nome.length > 200)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const id = await verifyUserName(user.user_name)
        
        let userGenresLength = user.generos.length
        let genresId = ""
        for(let i = 0; i < userGenresLength; i++) {
            if (userGenresLength == 1)
                genresId += `(${user.id}, ${user.generos[0].id_genero})`

            else if(i == userGenresLength - 1)
                genresId += `(${user.id}, ${user.generos[i].id_genero})`

            else {
                genresId += `(${user.id}, ${user.generos[i].id_genero}), `
            }
        }

        if(user.id_tag_1 == undefined)
            user.id_tag_1 = null
        else if (user.id_tag_2 == undefined)
            user.id_tag_2 = null

        if(id.length > 0)
            return {status: 400, message: MESSAGE_ERROR.INVALID_UPDATE_USERNAME}
        else {
            const updatedUser = await userModel.updateUser(user, genresId)
    
            if(updatedUser)
                return {status: 200, message: MESSAGE_SUCCESS.UPDATE_ITEM}
            else
                return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
        }
    } 
}

const updateUserPassword = async (user) => {
    if(user.senha != '' && user.senha != undefined) {
        const updatedPassword = await userModel.updateUserPassword(user)

        if(updatedPassword)
            return {status: 200, message: MESSAGE_SUCCESS.UPDATE_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    } else {
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    }
}

const deleteUser = async (id) => {
    if(id != '' & id != undefined) {
        const deletedUser = await userModel.deleteUser(id)

        if(deletedUser)
            return {status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM}
        else 
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    } else
        return {status: 400, message: MESSAGE_ERROR.REQUIRED_ID}
}

const selectUserByUsername = async (userName, userId) => {
    if(userName != '' && userName != undefined || userId != '' && userId != undefined) {
        const userByUsername = await userModel.selectUserByUsername(userName)

        await verifyUserFollow(userByUsername, userId)

        if(userByUsername) {
            let userByUsernameJson = {}

            const userDataArray = await destructureUserJson(userByUsername)

            userByUsernameJson = await Promise.all(userDataArray)
            return {status: 200, message: userByUsernameJson}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    } else
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
}

const listAllUsers = async () => {
    const usersData = await userModel.selectAllUsers()
    
    if(usersData) {
        let usersJson = {}

        const usersDataArray = await destructureUserJson(usersData)

        usersJson.users = await Promise.all(usersDataArray)
        return {status: 200, message: usersJson}
    } else
        return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
}

const userLogin = async (userUID) => {
    if(userUID == '' || userUID == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const jwt = require('../../middleware/jwt.js')

        const login = await userModel.login(userUID)

        if(login) {
            let userToken = await jwt.createJwt(login)
            login.token = userToken
            return { status: 200, message: login }
        }
        else 
            return { message: MESSAGE_ERROR.NOT_FOUND_DB, status: 404 } 
    }
}

const searchUserByID = async (userId) => {
    if(userId != undefined && userId != '') {
        const userData = await userModel.selectUserByID(userId)

        if(userData) {
            let userJson = {}
            
            const userDataArray = await destructureUserJson(userData)

            userJson = await Promise.all(userDataArray)
            return {status: 200, message: userJson[0]}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB} 
    } else 
        return {status: 400, message: MESSAGE_ERROR.REQUIRED_ID}
}

const verifyUserName = async (userName) => {
    if(userName == '' && userName == undefined)
        return {status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS}
    else {
        const userId = await userModel.verifyUserName(userName)

        if(userId) {
            return {status: 200, message: userId[0]}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    }
}

module.exports = {
    newUser,
    listAllUsers,
    userLogin,
    updateUser,
    updateUserPassword,
    deleteUser,
    selectUserByUsername,
    listAllUsers,
    searchUserByID,
    verifyUserName
}