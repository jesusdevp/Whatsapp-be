import logger from "../configs/logger.config.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import { createMessage, getConverMessages, populateMessage } from "../services/message.service.js";


export const sendMessage = async (req, res, next) => {

    try {
        const user_id = req.user.userId
        const { message, conver_id, files } = req.body

        if ( !conver_id || (!message && !files) ) {
          logger.error('Please provider a conversation id and a message body')
          return res.sendStatus(400)
        }

        const messageData = {
          sender: user_id,
          message,
          conversation: conver_id,
          files: files || [],
        }

        let newMessage = await createMessage( messageData )
        let populatedMessage = await populateMessage( newMessage._id )

        await updateLatestMessage( conver_id, newMessage )

        res.json( populatedMessage )

      } catch ( error ) {

        next( error )
      }
    
}

export const getMessages = async (req, res, next) => {

    try {
        const conver_id = req.params.conver_id;
        if ( !conver_id ) {

            logger.error('Please add a conversation id in params')
            res.sendStatus(400)
        }

        const messages = await getConverMessages( conver_id )
        res.json( messages )

    } catch ( error ) {

        next( error )
    }

}