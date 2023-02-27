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

const newUser = async (user) => {
    if(user.user_name == '' || user.user_name == undefined || user.nome == '' || user.nome == undefined || user.data_nascimento == ''|| user.data_nascimento == undefined || user.email == '' || user.email == undefined || user.senha == ''|| user.senha == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(!user.email.includes('@'))
        return { status: 400, message: MESSAGE_ERROR.INVALID_EMAIL }
    else if(user.user_name.length > 30 || user.nome.length > 200 || user.email.length > 256 || user.senha.length > 100)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        user.premium = 0

        const id = await verifyUserName(user.user_name)

        if(id.length > 0) {
            return {status: 400, message: MESSAGE_ERROR.INVALID_USERNAME}
        } else {
            const resultNewUser = await userModel.insertUser(user)
                    
                if(resultNewUser)
                    return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
                else
                    return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
        }

    }
}
const updateUser = async (user) => {
    if(user.user_name == '' || user.user_name == undefined || user.nome == '' || user.nome == undefined || user.data_nascimento == ''|| user.data_nascimento == undefined || user.foto == '' || user.foto == undefined || user.biografia == '' || user.biografia == undefined || user.email == '' || user.email == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(!user.email.includes('@'))
        return { status: 400, message: MESSAGE_ERROR.INVALID_EMAIL }
    else if(user.user_name.length > 30 || user.nome.length > 200 || user.email.length > 256)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const updatedUser = await userModel.updateUser(user)

        if(updatedUser)
            return {status: 200, message: MESSAGE_SUCCESS.UPDATE_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
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

const deleteUser = async () => {

}

const selectUserByUsername = async (username) => {

}

const listAllUsers = async () => {
    let usersJson = {}

    const usersData = await userModel.selectAllUsers()

    if(usersData) {
        usersJson.users = usersData
        return {status: 200, message: usersJson}
    } else
        return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
}

const userLogin = async (userLogin, userPassword) => {
    if(userLogin == '' || userLogin == undefined || userPassword == '' || userPassword == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const jwt = require('../../middleware/jwt.js')

        const login = await userModel.login(userLogin, userPassword)

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

            userJson.user = userData
            return {status: 200, message: userJson}
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
            return userId
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    }
}

module.exports = {
    newUser,
    userLogin,
    updateUser,
    updateUserPassword,
    listAllUsers,
    searchUserByID
}