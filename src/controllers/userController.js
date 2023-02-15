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
        const resultNewUser = userModel.insertUser(user)

        if(resultNewUser)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}
const updateUser = async (user) => {

}

const deleteUser = async () => {

}

const selectUserByUsername = async (username) => {

}

const userLogin = async (userData) => {
    if(userData.user_name == '' || userData.user_name == undefined || userData.senha == '' || userData.senha == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const login = await userModel.login(userData)

        if(login)
            return { status: 200, message: login[0] }
        else 
            return { message: MESSAGE_ERROR.NOT_FOUND_DB, status: 404 } 
    }
}

module.exports = {
    newUser,
    userLogin
}