const jwt = require('jsonwebtoken')
const { MESSAGE_SUCCESS } = require('../wwwroot/module/config.js')

const createJwt = async (user) => {
    const token = jwt.sign({
        id: user.id,
        login: user.user_name,
    }, process.env.SECRET, {
        expiresIn: '5d'
    })
    const id = user.id

    return { status: 200, response: { message: MESSAGE_SUCCESS.JWT_CREATED, token, id } };
}

const validateJwt = async (token) => {
    let jwtStatus
    jwt.verify(token, process.env.SECRET, async (error, decode) => {
        if(error) {
            jwtStatus = false
        } else {
            jwtStatus = true
        }
    })
    return jwtStatus
}

module.exports = {
    createJwt,
    validateJwt
}