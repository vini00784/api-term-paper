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

// Cors configuration to release API access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-type')

    app.use(cors())
    next()
})

// Importing of routers
const genreRouter = require('./routes/genreRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const tagRouter = require('./routes/tagRoutes.js')
const announcementRouter = require('./routes/announcementRoutes.js')

// Using routers

app.use(userRouter)
app.use(genreRouter)
app.use(tagRouter)
app.use(announcementRouter)

// Using routers

const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log("Server waiting requests...")
})