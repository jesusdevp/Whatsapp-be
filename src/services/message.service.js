import MessageModel from "../models/messageModel.js"
import createHttpError from "http-errors"

export const createMessage = async ( message ) => {
    let newMessage = await MessageModel.create( message )

  if (!newMessage) throw createHttpError.BadRequest('Something went wrong !')
  return newMessage
}

export const populateMessage = async ( newMessageId ) => {

    let msg = await MessageModel.findById( newMessageId )
    .populate({
      path: 'sender',
      select: 'name picture',
      model: 'UserModel',
    })
    .populate({
      path: 'conversation',
      select: 'name picture isGroup users',
      model: 'ConversationModel',
      populate: {
        path: 'users',
        select: 'name email picture status',
        model: 'UserModel',
      },
    });

  if ( !msg ) throw createHttpError.BadRequest('Something went wrong');

  return msg;

}

export const getConverMessages = async ( conver_id ) => {

    const messages = await MessageModel.find({ conversation: conver_id })
    .populate('sender', 'name picture email status')
    .populate('conversation')

  if (!messages) throw createHttpError.BadRequest('Something went wrong !');

  return messages;
}