/*
    Objetivo:     File responsible for handling buys of books data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/05/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Follower model
const followerModel = require('../models/DAO/followers.js')

const followUser = async (follow) => {
    if(follow.id_segue == ''|| follow.id_segue == undefined || follow.id_seguindo == '' || follow.id_seguindo == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newFollower = await followerModel.insertFollower(follow)

        if(newFollower)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

module.exports = { 
    followUser
}