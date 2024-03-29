/*
    Objetivo:     File responsible for configuring variables, constants and system messages, processing and returning data between the API and the Model
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

const MESSAGE_ERROR = {
    REQUIRED_FIELDS: 'Existe(m) algum(s) campo(s) obrigatório(s) que deve(m) ser enviado(s)!',
    INVALID_EMAIL: 'O e-mail informado não é válido',
    INCORRECT_CONTENT_TYPE: 'O cabeeçalho da requisição não possui um Content-Type válido!',
    EMPTY_BODY: 'O body da requisição não pode ser vazio',
    NOT_FOUND_DB: 'Não foram encontrados registros no Banco de Dados!',
    INTERNAL_ERROR_DB: 'Não foi possível realizar a operação com o banco de dados',
    REQUIRED_ID: 'O id do registro é obrigatório neste tipo de requisição!',
    EXCEEDED_CHARACTERS: 'Número de caracteres excedido!',
    INVALID_USER: 'Falha na autenticação',
    INVALID_USERNAME: 'Esse UserName já foi cadastrado anteriormente!',
    INVALID_UPDATE_USERNAME: 'Escolha um UserName diferente do anterior!',
    ALREADY_EXISTS_CART: 'Você já possui um carrinho ativo!',
    EMPTY_CART: 'Não há itens no carrinho',
    ANY_ACTIVE_CART: 'Você não possui nenhum carrinho ativo!'
}

const MESSAGE_SUCCESS = {
    INSERT_ITEM: 'Item criado com sucesso no Banco de Dados',
    UPDATE_ITEM: 'Item atualizado com sucesso no Banco de Dados',
    DELETE_ITEM: 'Item excluído com sucesso no Banco de Dados',
    JWT_CREATED: 'Web Token criado com sucesso!',
    DESACTIVATE_ITEM: 'Item desativado com sucesso!',
    ACTIVATE_ITEM: 'Item ativado com sucesso!',
    BUY_SUCCESS: 'Compra feita com sucesso',
    INSERT_CART_ITEM: 'Anúncio inserido no carrinho!'
}

module.exports = {
    MESSAGE_ERROR,
    MESSAGE_SUCCESS
}