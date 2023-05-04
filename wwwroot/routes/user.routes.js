const express = require('express')
const jsonParser = express.json()
const userController = require('../controllers/userController.js')
const verifyUserLogin = require('../../middleware/verifyUserLogin.js')
const jwt = require('../../middleware/jwt.js')

// Function to verify jwt
const verifyJwt = async (req, res, next) => {
    let token = req.headers['x-access-token']
    const authenticatedToken = await jwt.validateJwt(token)

    if(authenticatedToken) {
        next()
    } else {
        return res.status(401).end()
    }
}

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')
const e = require('express')

const router = express.Router()

/* ROUTE TO MAKE TESTS*/

router
    .route('/users')
    .get(async(req, res) => {
        let statusCode
        let message

        const usersData = await userController.listAllUsers()

        if(usersData) {
            statusCode = usersData.status
            message = usersData.message
        } else {
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

/* ROUTE TO MAKE TESTS*/

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
                console.log(bodyData)
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

router // Route to get user by ID, update user and delete user
    .route('/user/id/?')
    .get(async(req, res) => {
        let statusCode
        let message
        let searchUser = req.query.searchUser
        let currentUser = req.query.currentUser
    
        if(searchUser != '' && searchUser != undefined) {
            const userData = await userController.searchUserByID(searchUser)

            const { verifyUserFollow } = require('../models/DAO/followers.js')

            const userFollowVerify = await verifyUserFollow(currentUser, searchUser)
            userData.message.seguindo = userFollowVerify
    
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

router
    .route('/user/id/:userId')
    .put(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType

        headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                let id = req.params.userId

                if(id != '' && id != undefined) {
                    bodyData.id = id

                    const updatedUser = await userController.updateUser(bodyData)

                    statusCode = updatedUser.status
                    message = updatedUser.message
                } else {
                    statusCode = 400
                    message = MESSAGE_ERROR.REQUIRED_ID
                }
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

    .delete(async(req, res) => {
        let statusCode
        let message

        let id = req.params.userId

        if(id != '' && id != undefined) {
            const deletedUser = await userController.deleteUser(id)

            statusCode = deletedUser.status
            message = deletedUser.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
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
            const userLogin = await userController.userLogin(bodyData.uid)

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
                        
                        return res.status(statusCode).json(message)
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

router // Route to get user by userName
    .route('/user/user-name/?')
    .get(async(req, res) => {
        let statusCode
        let message

        let userName = req.query.username
        let userId = req.query.userId

        if(userName != '' && userName != undefined || userId != '' && userId != undefined) {
            const userByUsernameData = await userController.selectUserByUsername(userName, userId)

            if(userByUsernameData) {
                statusCode = userByUsernameData.status
                message = userByUsernameData.message
            } else {
                statusCode = 404
                message = MESSAGE_ERROR.NOT_FOUND_DB
            }
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_FIELDS
        }

        res.status(statusCode).json(message)
    })

router // Route to update user password
    .route('/password/:userId')
    .put(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData)) {
                let id = req.params.userId
                
                if(id != '' && id != undefined) {
                    bodyData.id = id

                    const updatedPassword = await userController.updateUserPassword(bodyData)

                    statusCode = updatedPassword.status
                    message = updatedPassword.message
                } else {
                    statusCode = 400
                    message = MESSAGE_ERROR.REQUIRED_ID
                }
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

router
    .route('/verify-username/:userName')
    .get(async (req, res) => {
        let statusCode
        let message

        let userName = req.params.userName

        if(userName != '' && userName != undefined) {
            const userId = await userController.verifyUserName(userName)

            statusCode = userId.status
            message = userId.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

module.exports = router