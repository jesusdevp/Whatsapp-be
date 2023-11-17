import createHttpError from "http-errors"
import logger from "../configs/logger.config.js"
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js"
import { findUser } from "../services/user.service.js"

export const create_open_conversation = async(req, res, next) => {

    try {
        
        const sender_id = req.user.userId
        const { receiver_id, isGroup } = req.body

        if( isGroup === false ) {

            if( !receiver_id ) {
                logger.error('Please provide he user id you wanna start a conversation with')
                throw createHttpError.BadGateway('Something went wrong')
            }
    
            // check if chat exist
            const existConversation = await doesConversationExist( sender_id, receiver_id, false )
    
            if( existConversation ) {
                res.json( existConversation )
            } else {
                // let receiver_user = await findUser( receiver_id )
    
                let converData = {
                    name: 'conversation name',
                    picture: 'conversation picture',
                    isGroup: false,
                    users: [ sender_id, receiver_id ]
                }
    
                const newConver = await createConversation( converData )
    
                const populateConver = await populateConversation( newConver._id, 'users', '-password' )
    
                res.status(200).json( populateConver )
            }
        } else {
            // is group chat
            const existed_group_conversation = await doesConversationExist(
                '',
                '',
                isGroup
              );
              res.status(200).json(existed_group_conversation);
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

    const { name, users } = req.body
  
    users.push(req.user.userId)

    if (!name || !users) {

      throw createHttpError.BadRequest('Please fill all fields.');
    }

    if (users.length < 2) {

      throw createHttpError.BadRequest(
        'Atleast 2 users are required to start a group chat.'
      )
    }

    let converData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE,
    }

    try {
      const newConver = await createConversation(converData)
      const populatedConver = await populateConversation(newConver._id,'users admin','-password');
      res.status(200).json(populatedConver)
    } catch (error) {
      next(error)
    }
}