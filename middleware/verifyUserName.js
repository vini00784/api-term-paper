const userController = require('../src/controllers/userController.js')

const verifyUserName = async (userName) => {
    const { users } = await userController.listAllUsers()
    let status = false
    
    await users.forEach(async user => {
        if(await userName != user.user_name) 
            status = true
        else
            status
    })

    return status
}

module.exports = {
    verifyUserName
}

// O código está dando certo, o único problema é que ele só funciona no primeiro item da tabela do banco de dados (teste 1)
    // Os testes com os demais itens dão erro e eles são criados normalmente