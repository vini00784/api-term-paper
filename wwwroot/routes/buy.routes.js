const express = require('express')
const jsonParser = express.json()
const buyController = require('../controllers/buyController.js')
const { paymentStripe } = require('../libs/stripe.js')

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

const router = express.Router()

router
    .route('/create-cart/user-id/:userId')
    .post(jsonParser, async(req, res) => {
        let statusCode
        let message
        let headerContentType = req.headers['content-type']
        let userId = req.params.userId

        if(headerContentType == 'application/json') {
            let bodyData = req.body

            if(JSON.stringify(bodyData) != '{}') {
                const newAnnouncementInCart = await buyController.createCart(bodyData, userId)

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
    .route('/intent-buy-announcement/user-id/:userId')
    .post(jsonParser, async (req, res) => {
        let headerContentType = req.headers['content-type']
        let bodyData = req.body

        const { searchAnnouncementById } = require('../controllers/announcementController.js')

        let userId = req.params.userId

        const item = await searchAnnouncementById(bodyData.id_anuncio)

        const data = { id: userId, products: [] }

        data.products = item.message.map(({
            titulo,
            preco,
            capa,
            sinopse
        }) => {
            return {
                name: titulo,
                images: [capa],
                price: preco * 100,
                description: sinopse
            }
        })

        const checkoutSession = await paymentStripe.createSession(data)

        res.status(200).json( {url: checkoutSession.url, intent_id: checkoutSession.id} )
    })

router
    .route('/intent-directly-payment-update')
    .post(jsonParser, async(req, res) => {
        try {
            let bodyData = req.body
            await buyController.newBuyWithoutCart(bodyData)
                
            return res.status(200).json({
                received: true
            })   
        } catch (err) {
            return res.status(400).json({
                received: err.message
            })
        }
    })

router
    .route('/intent-buy/user-id/:userId')
    .post(jsonParser, async(req, res) => {
        let userId = req.params.userId
    
        const listCartItems = await buyController.listCartItems(userId)

        const data = { id: userId, products: [] };

        data.products = listCartItems.message.items.map(({
            titulo,
            preco,
            capa,
            sinopse
            }) => {
            return {
                name: titulo,
                images: [capa],
                price: preco * 100,
                description: sinopse
            }
        })

        // Id < --
        const checkoutSession = await paymentStripe.createSession(data) // add
        
        await buyController.newStripePaymentId(userId, checkoutSession.id)

        res.status(200).json( {url: checkoutSession.url, intent_id: checkoutSession.id} )
    })

router
    .route('/purchased-announcements/user-id/:userId')
    .get(async(req, res) => {
        let statusCode
        let message
        let userId = req.params.userId

        const purchasedAnnouncements = await buyController.listPurchasedAnnouncements(userId)

        if(purchasedAnnouncements) {
            statusCode = purchasedAnnouncements.status
            message = purchasedAnnouncements.message
        } else {
            statusCode = 400
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }

        res.status(statusCode).json(message)
    })

router
    .route('/intent-payment-update')
    .post(jsonParser, async (req, res) => {
        try {
            const id = req.body.data.object.id

            const { selectCartByStripeId } = require('../models/DAO/buy.js')
            const cartItems = await selectCartByStripeId(id)

            await buyController.confirmBuy(cartItems[0].id_usuario)
                
            return res.status(200).json({
                received: true
            })   

        } catch (error) {
            return res.status(200).json({
                received: error.message
            })   
        }
    })

module.exports = router