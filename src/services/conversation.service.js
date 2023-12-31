import createHttpError from "http-errors"
import { ConversationModel, UserModel } from "../models/index.js"


export const doesConversationExist = async ( sender_id, receiver_id, isGroup ) => {

    if( isGroup === false ) {
        let convers = await ConversationModel.find({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: sender_id } } },
                { users: { $elemMatch: { $eq: receiver_id } } }
            ]
        })
        .populate('users', '-password')
        .populate('latestMessage')
    
        if( !convers ) throw createHttpError.BadGateway('!ops something went wrong')
    
        convers = await UserModel.populate(convers, {
            path: 'latestMessage.sender',
            select: 'name email picture status'
        })
    
        return convers[0]
    } else { 

        // is group chat

        let conver = await ConversationModel.findById(isGroup)
            .populate('users admin', '-password')
            .populate('latestMessage');

        if (!conver)
        throw createHttpError.BadRequest('Something went wrong');
        //populate message model
        conver = await UserModel.populate(conver, {
            path: 'latestMessage.sender',
            select: 'name email picture status',
        });

        return conver;
    }

}

export const createConversation = async (newConverData) => {

    const newConver = await ConversationModel.create( newConverData )

    if( !newConverData ) throw createHttpError.BadRequest('!ops something went wrong')

    return newConver;
}

export const populateConversation = async ( id, fieldPopulate, fieldRemove  ) => {

    const populateConver = await ConversationModel.findOne({ _id: id }).populate( fieldPopulate, fieldRemove )

    if( !populateConver ) throw createHttpError.BadGateway('!ops something went wrong')

    return populateConver;

}

export const getUserConversations = async ( userId ) => {

    let conversations;

    await ConversationModel.find({
        users: { $elemMatch: { $eq: userId } }
    })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then( async ( results ) => {
        results = await UserModel.populate(results, {
            path: 'latestMessage.sender',
            select: 'name email picture status'
        })
        conversations = results
    })
    .catch(( error ) => {
        throw createHttpError.BadGateway('!ops something went wrong')
    })

    return conversations
}

export const updateLatestMessage = async ( conver_id, message ) => {
    const updatedConver = await ConversationModel.findByIdAndUpdate(conver_id, {
      latestMessage: message,
    })

    if (!updatedConver) throw createHttpError.BadRequest('Something went wrong');
  
    return updatedConver;
  };