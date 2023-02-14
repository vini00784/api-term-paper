/*
    Objetivo:     API responsible for handling user data with the Database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 14/02/2023
    Versão:       1.0
*/

// Import from the PrismaClient class, which is responsible for interactions with the Database
const { PrismaClient } = require('@prisma/client')

// Instance of the PrismaClient class
const prisma = new PrismaClient()

const insertUser = async (user) => {

}

const updateUser = async (user) => {

}

const deleteUser = async (id) => {

}

const selectUserByUsername = async (username) => {

}