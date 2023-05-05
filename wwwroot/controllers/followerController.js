/*
    Objetivo:     File responsible for handling buys of books data from the database (INSERT, UPDATE, SELECT, DELETE)
    Autores:      Vinícius Santos Oliveira
    Data Criação: 03/05/2023
    Versão:       1.0
*/

// File with standardized messages
const { MESSAGE_SUCCESS, MESSAGE_ERROR } = require('../module/config.js')

// Follower model
const followerModel = require('../models/DAO/followers.js')

// Function to select user genres
const { selectGenreByUserId } = require('../models/DAO/genre.js')

const followUser = async (follow) => {
    if(follow.id_segue == ''|| follow.id_segue == undefined || follow.id_seguindo == '' || follow.id_seguindo == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const newFollower = await followerModel.insertFollower(follow)

        if(newFollower)
            return { status: 200, message: MESSAGE_SUCCESS.INSERT_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const unfollowUser = async (followerId, followedId) => {
    if(followerId == ''|| followerId == undefined || followedId == '' || followedId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const removeFollow = await followerModel.deleteFollow(followerId, followedId)

        if(removeFollow)
            return { status: 200, message: MESSAGE_SUCCESS.DELETE_ITEM }
        else
            return { status: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

const listUserFollowers = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const userFollowers = await followerModel.selectUserFollowers(userId)
        
        if(userFollowers) {
            let followersJson = {}
            
            const userDataArray = userFollowers.map(async element => {
                const follwersGenres = await selectGenreByUserId(element.id)
                element.generos = follwersGenres

                return element
            })
            
            followersJson = await Promise.all(userDataArray)
            return {status: 200, message: followersJson}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    }
}

const listFollowingUsers = async (userId) => {
    if(userId == '' || userId == undefined)
        return { status: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }
    else {
        const followingUsers = await followerModel.selectFollowingUsers(userId)

        if(followingUsers) {
            let followingJson = {}

            const userDataArray = followingUsers.map(async element => {
                const followingGenres = await selectGenreByUserId(element.id)
                element.generos = followingGenres

                return element
            })

            followingJson = await Promise.all(userDataArray)
            return {status: 200, message: followingJson}
        } else
            return {status: 404, message: MESSAGE_ERROR.NOT_FOUND_DB}
    }
}

module.exports = { 
    followUser,
    unfollowUser,
    listUserFollowers,
    listFollowingUsers
}