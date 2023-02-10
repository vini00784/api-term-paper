/*
    Objetivo:     API responsible for handling Back-End data
                  (GET, POST, PUT, DELETE)
    Autor:        Vinícius Santos Oliveira
    Data Criação: 03/02/2023
    Versão:       1.0
    
    Anotações:
    Comandos a serem rodados (nessa sequência) além do express, cors e body-parser:
        O prisma é necessário para a manipulação do acesso ao Banco de Dados
            npm install prisma --save
            npx prisma
            npx prisma init
            npx install @prisma/client
                Eles preparam o ambiente de utilização do Prisma
                npx prisma migrate dev --> comando que faz uma ligação do prisma com o banco, é feito para testar se o prisma realmente consegue acessar o banco
                    É importante rodar esse comando no início do projeto para ver se está dando tudo certo
                    O sucesso da criação de uma tabela de teste mostra que a interação com o banco está acontecendo.
                        OBS.: Esse comando de teste limpa tudo o que tem no banco, por isso ele deve ser rodada NO INÍCIO DO PROJETO!!!
*/

// Importing libraries
const fastify = require('fastify')
const cors = require('cors')
const bodyParser = require('body-parser')


// Cors configuration to release API access
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methos', 'GET, POST, PUT, DELETE, OPTIONS')
    
    app.use(cors())
    next()
})
    
// Creating an object that allows you to receive a JSON in the body of requests
const jsonParser = bodyParser.json()

const buildApp = () => {
    const app = fastify()
    
    app.get('/hello', async (req, reply) => {
        return reply.send({
            message: "Hello World \n"
        })
    })

    return app
}

module.exports = buildApp