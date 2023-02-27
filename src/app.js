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

// Function to generate jwt
const jwt = require('../middleware/jwt.js')

// Cors configuration to release API access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-type')

    app.use(cors())
    next()
})

// Exporting of routers
const genreRouter = require('./routes/genreRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const verifyJwt = async (req, res, next) => {
    let token = req.headers['x-access-token']
    const authenticatedToken = await jwt.validateJwt(token)

    if(authenticatedToken) {
        next()
    } else {
        return res.status(401).end()
    }
}

// Using routers

app.use(userRouter)
app.use(genreRouter)

// Using routers

app.listen(3030, () => {
    console.log("Server waiting requests...")
})