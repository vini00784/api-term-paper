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

'teste'

// Importing of routers
const genreRouter = require('./wwwroot/routes/genre.routes.js')
const userRouter = require('./wwwroot/routes/user.routes.js')
const tagRouter = require('./wwwroot/routes/tag.routes.js')
const announcementRouter = require('./wwwroot/routes/announcement.routes.js')
const parentalRatingRouter = require('./wwwroot/routes/parentalRating.routes.js')
const shortStorieRouter = require('./wwwroot/routes/shortStorie.routes.js')
const complaintsRouter = require('./wwwroot/routes/complaint.routes.js')
const buyRouter = require('./wwwroot/routes/buy.routes.js')
const followerRouter = require('./wwwroot/routes/follower.routes.js')
const commentRouter = require('./wwwroot/routes/comment.routes.js')
const recommendationRouter = require('./wwwroot/routes/recommendation.routes.js')
const dashboardRouter = require('./wwwroot/routes/dashboard.routes.js')

// Using routers

app.use(userRouter)
app.use(genreRouter)
app.use(tagRouter)
app.use(announcementRouter)
app.use(parentalRatingRouter)
app.use(shortStorieRouter)
app.use(complaintsRouter)
app.use(buyRouter)
app.use(followerRouter)
app.use(commentRouter)
app.use(recommendationRouter)
app.use(dashboardRouter)

// Using routers

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'TESTE'
    })
})

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server waiting requests...")
})