import createHttpError from "http-errors"
import { ConversationModel, UserModel } from "../models/index.js"


export const doesConversationExist = async ( sender_id, receiver_id ) => {

    let convers = await ConversationModel.find({
        isGroup: false,
        $and: [
            { user: { $elemMatch: { $eq: sender_id } } },
            { user: { $elemMatch: { $eq: receiver_id } } }
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