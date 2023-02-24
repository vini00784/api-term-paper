const userController = require('../src/controllers/userController.js')

const verifyLogin = async (userInfos) => {
    const object = await userController.listAllUsers()
    let foundUser
    
    object.message.users.forEach(user => {
        if(user.user_name == userInfos.user_name && user.senha == userInfos.senha) {
            foundUser = user
        }
    })

    return foundUser
}

module.exports = {
    verifyLogin
}