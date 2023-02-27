const express = require('express')
const jsonParser = express.json()
const userController = require('../controllers/userController.js')
const verifyUserLogin = require('../../middleware/verifyUserLogin.js')
const jwt = require('../../middleware/jwt.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router // Route to register a new user
    .route('/user')
    .post(jsonParser, async(req, res) => {
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

router // Route to get user by ID
    .route('/user/id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let id = req.params.userId
    
        if(id != '' && id != undefined) {
            const userData = await userController.searchUserByID(id)
    
            if(userData) {
                statusCode = userData.status
                message = userData.message
            } else {
                statusCode = userData.status
                message = userData.message
            }
        } else {
            statusCode = userData.status
            message = userData.message
        }
    
        res.status(statusCode).json(message)
    })

router // Route to make user login
    .route('/user/login')
    .post(jsonParser, async(req, res) => {
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

router // Route to update user
    .route('/user/user-name/:username')
    .get(async(req, res) => {
        
    })

router // Route to update and delete user
    .route('/user/:userId')
    .put(jsonParser, async(req, res) => {

    })

    .delete(async(req, res) => {

    })

module.exports = router

// app.get('/users', cors(), async(req, res)

// app.delete('/user/:userId', cors(), jsonParser, async(req, res)