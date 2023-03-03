/*
    Objetivo:     File responsible for handling tag data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Tag model
const tagModel = require('../models/DAO/tag.js')

const listTagByUserId = async (userId) => {
    if(userId != '' && userId != undefined) {
        const tagsData = await tagModel.selectTagByUserId(userId)

        if(tagsData) {
            let tagsJson = {}

            tagsJson.tags = tagsData
            return {status: 200, message: tagsJson}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    } else
        return {status: 400, message: MESSAGE_ERROR.REQUIRED_ID}
}

module.exports = {
    listTagByUserId
}