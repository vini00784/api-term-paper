/*
    Objetivo:     File responsible for handling short stories data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 17/03/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Short storie model
const shortStorieModel = require('../models/DAO/shortStorie.js')

const newShortStorie = async (shortStorie) => {
    if(shortStorie.titulo == '' || shortStorie.titulo == undefined || shortStorie.sinopse == '' || shortStorie.sinopse == undefined || shortStorie.capa == '' || shortStorie.capa == undefined || shortStorie.historia == '' || shortStorie.historia == undefined || shortStorie.id_usuario == '' || shortStorie.id_usuario == undefined || shortStorie.id_tipo_publicacao == '' || shortStorie.id_tipo_publicacao == undefined || shortStorie.id_classificacao == '' || shortStorie.id_classificacao == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else if(shortStorie.titulo.length > 50 || shortStorie.sinopse.length > 200 || shortStorie.capa.length > 500)
        return { status: 400, message: MESSAGE_ERROR.EXCEEDED_CHARACTERS }
    else {
        const currentDate = new Date().toJSON().slice(0, 10)
        shortStorie.data = currentDate
        shortStorie.status = 1

        let shortStorieGenresLength = shortStorie.generos.length
        let genresId = ""

        for(let i = 0; i < shortStorieGenresLength; i++) {
            if(shortStorieGenresLength == 1)
                genresId += `(@id_curta_criado, ${shortStorie.generos[0].id_genero})`

            else if (i == shortStorieGenresLength - 1) 
                genresId += `(@id_curta_criado, ${shortStorie.generos[i].id_genero})`

            else 
                genresId += `(@id_curta_criado, ${shortStorie.generos[i].id_genero}), `
            
        }

        const resultNewShortStorie = await shortStorieModel.insertShortStorie(shortStorie, genresId)

        if(resultNewShortStorie)
            return {status: 201, message: MESSAGE_SUCCESS.INSERT_ITEM}
        else
            return {status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB}
    }
}

module.exports = {
    newShortStorie
}