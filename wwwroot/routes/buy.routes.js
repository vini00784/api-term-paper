const express = require('express')
const jsonParser = express.json()
const buyController = require('../controllers/buyController.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/buy-announcement')
    .post(jsonParser, async (req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementBuy = await buyController.newBuyWithoutCart(bodyData)

                statusCode = newAnnouncementBuy.status
                message = newAnnouncementBuy.message
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
    .route('/create-cart')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementInCart = await buyController.createCart(bodyData)

                statusCode = newAnnouncementInCart.status
                message = newAnnouncementInCart.message
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
    .route('/new-cart-item/user-id/:userId')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId
        let headerContentType = req.headers['content-type']

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newCartItem = await buyController.insertItemCart(bodyData, userId)

                statusCode = newCartItem.status
                message = newCartItem.message
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
    .route('/list-cart-items/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        if(userId != '' && userId != undefined) {
            const cartItems = await buyController.listCartItems(userId)

            statusCode = cartItems.status
            message = cartItems.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/delete-cart-item/?')
    .delete(async(req, res) => {
        let statusCode
        let message
        let announcementId = req.query.announcementId
        let userId = req.query.userId

        if(announcementId != '' && announcementId != undefined && userId != '' && userId != undefined) {
            const deletedCartItem = await buyController.deleteCartItem(announcementId, userId)

            statusCode = deletedCartItem.status
            message = deletedCartItem.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.REQUIRED_ID
        }

        res.status(statusCode).json(message)
    })

router
    .route('/confirm-buy/user-id/:userId')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId
        
        const confirmedBuy = await buyController.confirmBuy(userId)

        statusCode = confirmedBuy.status
        message = confirmedBuy.message

        res.status(statusCode).json(message)
    })

module.exports = router