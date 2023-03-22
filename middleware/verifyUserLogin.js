const userController = require('../src/controllers/userController.js')

const verifyLogin = async (userInfos) => {
    const object = await userController.listAllUsers()
    let foundUser
    
    object.message.users.forEach(user => {
        if((user.uid == userInfos.uid)) {
            foundUser = user
        }
    })

    return foundUser
}

module.exports = {
    verifyLogin
}