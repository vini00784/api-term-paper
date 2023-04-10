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
const genreRouter = require('./wwwroot/routes/genreRoutes.js')
const userRouter = require('./wwwroot/routes/userRoutes.js')
const tagRouter = require('./wwwroot/routes/tagRoutes.js')
const announcementRouter = require('./wwwroot/routes/announcementRoutes.js')
const parentalRatingRouter = require('./wwwroot/routes/parentalRatingRoutes.js')
const shortStorieRouter = require('./wwwroot/routes/shortStorieRoutes.js')
const complaintsRouter = require('./wwwroot/routes/complaintRoutes.js')

// Using routers

app.use(userRouter)
app.use(genreRouter)
app.use(tagRouter)
app.use(announcementRouter)
app.use(parentalRatingRouter)
app.use(shortStorieRouter)
app.use(complaintsRouter)

// Using routers

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'TESTE'
    })
})

const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log("Server waiting requests...")
})