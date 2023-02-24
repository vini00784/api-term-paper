/*
    Objetivo:     API responsible for handling Back-End data
                  (GET, POST, PUT, DELETE)
    Autor:        Vinícius Santos Oliveira
    Data Criação: 03/02/2023
    Versão:       1.0
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
    response.header('Access-Control-Allow-Headers', 'Content-type')

    app.use(cors())
    next()
})
    
// Creating an object that allows you to receive a JSON in the body of requests
const jsonParser = express.json()

// Exporting of routers
const genreRouter = require('./routes/genreRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const verifyJwt = async (request, response, next) => {
    let token = request.headers['x-access-token']
    const authenticatedToken = await jwt.validateJwt(token)

    if(authenticatedToken) {
        next()
    } else {
        return response.status(401).end()
    }
}

app.use(userRouter)

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

app.use(genreRouter)

app.listen(3030, () => {
    console.log("Server waiting requests...")
})