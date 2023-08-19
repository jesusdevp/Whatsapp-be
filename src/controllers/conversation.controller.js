import createHttpError from "http-errors"
import logger from "../configs/logger.config.js"
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js"
import { findUser } from "../services/user.service.js"

export const create_open_conversation = async(req, res, next) => {

    try {
        
        const sender_id = req.user.userId
        const { receiver_id } = req.body

        if( !receiver_id ) {
            logger.error('Please provide he user id you wanna start a conversation with')
            throw createHttpError.BadGateway('Something went wrong')
        }

        // check if chat exist
        const existConversation = await doesConversationExist( sender_id, receiver_id )

        if( existConversation ) {
            res.json( existConversation )
        } else {
            let receiver_user = await findUser( receiver_id )

            let converData = {
                name: receiver_user.name,
                isGroup: false,
                users: [ sender_id, receiver_id ]
            }

            const newConver = await createConversation( converData )

            const populateConver = await populateConversation( newConver._id, 'users', '-password' )

            res.status(400).json( populateConver )
        }

    } catch (error) {
        next(error)
    }

}

export const getConversations = async(req, res, next) => {

    try {

        const user_id = req.user.userId

        const conversations = await getUserConversations( user_id )

        res.status(200).json( conversations )
        
    } catch (error) {
        next(error)
    }

}

export const createGroup = async(req, res, next) => {

    try {
        
    } catch (error) {
        next(error)
    }

}