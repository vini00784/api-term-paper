/*
    Objetivo:     API responsible for handling Back-End data
                  (GET, POST, PUT, DELETE)
    Autor:        Vinícius Santos Oliveira
    Data Criação: 03/02/2023
    Versão:       1.0
    
    Anotações:
    Comandos a serem rodados (nessa sequência) além do express, cors e body-parser:
        O prisma é necessário para a manipulação do acesso ao Banco de Dados
            npm install prisma --save
            npx prisma
            npx prisma init
            npx install @prisma/client
                Eles preparam o ambiente de utilização do Prisma
                npx prisma migrate dev --> comando que faz uma ligação do prisma com o banco, é feito para testar se o prisma realmente consegue acessar o banco
                    É importante rodar esse comando no início do projeto para ver se está dando tudo certo
                    O sucesso da criação de uma tabela de teste mostra que a interação com o banco está acontecendo.
                        OBS.: Esse comando de teste limpa tudo o que tem no banco, por isso ele deve ser rodada NO INÍCIO DO PROJETO!!!
*/

// Importing libraries
const express = require('express')
const cors = require("cors")
const app = express()

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('./module/config.js')

// Import of controllers
const userController = require('./controllers/userController.js')

// Cors configuration to release API access
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methos', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})
    
// Creating an object that allows you to receive a JSON in the body of requests
const jsonParser = express.json()

// Routes to user CRUD

app.post('/user', cors(), jsonParser, async(req, res) => {
    let statusCode
    let message
    let headerContentType

    headerContentType = req.headers['content-type']

    if(headerContentType == 'application/json') {
        let bodyData = req.body

        if(JSON.stringify(bodyData) != '') {
            const newUser = await userController.newUser(bodyData)

            statusCode = newUser.status
            message = newUser.message
        }
    } else {
        statusCode = 415
        message = MESSAGE_ERROR.INCORRECT_CONTENT_TYPE
    }

    res.status(statusCode).json(message)
})

app.get('/users', cors(), async(req, res) => {
    
})

app.get('/user/user-name/:userName', cors(), async(req, res) => {

})

app.put('/user/:userId', cors(), jsonParser, async(req, res) => {

})

app.delete('/user/:userId', cors(), jsonParser, async(req, res) => {

})

// Routes to user CRUD

app.listen(3030, () => {
    console.log("Server waiting requests...")
})