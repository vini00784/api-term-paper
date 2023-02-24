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

// Function to generate jwt
const jwt = require('../middleware/jwt.js')
const verifyUserLogin = require('../middleware/verifyUserLogin.js')

// Cors configuration to release API access
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methos', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})
    
// Creating an object that allows you to receive a JSON in the body of requests
const jsonParser = express.json()

const verifyJwt = async (request, response, next) => {
    let token = request.headers['x-access-token']
    const authenticatedToken = await jwt.validateJwt(token)

    if(authenticatedToken) {
        next()
    } else {
        return response.status(401).end()
    }
}

// Routes to user CRUD

app.post('/user', cors(), jsonParser, async(req, res) => {
    let statusCode
    let message
    let headerContentType

    headerContentType = req.headers['content-type']

    if(headerContentType == 'application/json') {
        let bodyData = req.body

        if(JSON.stringify(bodyData) != '{}') {
            const newUser = await userController.newUser(bodyData)

            statusCode = newUser.status
            message = newUser.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.EMPTY_BODY
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

app.get('/user/id/:userId', cors(), async(req, res) => {
    let statusCode
    let message
    let id = req.params.userId

    if(id != '' && id != undefined) {
        const userData = await userController.searchUserByID(id)

        if(userData) {
            statusCode = 200
            message = userData
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    } else {
        statusCode = 400
        message = MESSAGE_ERROR.REQUIRED_ID
    }

    res.status(statusCode).json(message)
})

app.put('/user/:userId', cors(), jsonParser, async(req, res) => {

})

app.delete('/user/:userId', cors(), jsonParser, async(req, res) => {

})

app.post('/user/login', cors(), jsonParser, async(req, res) => {
    let statusCode
    let message
    let headerContentType

    headerContentType = req.headers['content-type']

    if(headerContentType == 'application/json') {
        let bodyData = req.body

        if(JSON.stringify(bodyData) != '{}') {
            const userLogin = await userController.userLogin(bodyData.user_name, bodyData.senha)

            if(userLogin.status == 200) {
                userLogin.message.forEach(async (userInfo) => {
                    const authenticatedUser = await verifyUserLogin.verifyLogin(userInfo)

                    if(authenticatedUser) {
                        const createJwt = await jwt.createJwt(authenticatedUser)
                        statusCode = createJwt.status
                        message = createJwt.response

                        return res.status(statusCode).json(message)
                    } else {
                        statusCode = 401
                        message = MESSAGE_ERROR.INVALID_USER
                        
                        return response.status(statusCode).json(message)
                    }
                })
            } else {
                statusCode = userLogin.status
                message = userLogin.message

                return res.status(statusCode).json(message)
            }

        } else {
            statusCode = 400
            message = MESSAGE_ERROR.EMPTY_BODY

            return res.status(statusCode).json(message)
        }
    } else {
        statusCode = 415
        message = MESSAGE_ERROR.INCORRECT_CONTENT_TYPE

        return res.status(statusCode).json(message)
    }
})

// Routes to user CRUD

app.listen(3030, () => {
    console.log("Server waiting requests...")
})