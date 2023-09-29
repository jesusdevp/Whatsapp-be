
import app from './app.js'
import mongoose from 'mongoose';
import logger from './configs/logger.config.js'
import { Server } from 'socket.io'
import SocketServer from './SocketServer.js';

// env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000

// exit on mongoDb error
mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${ err }`)
    process.exit(1)
})

// mongoDB debug mode
if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
}

//mongodb conection
mongoose.connect( DATABASE_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    logger.info('Connected to MongoDB')
})

let server; 

server = app.listen( PORT, () => {
    logger.info( `Server listening at ${ PORT }` )
})

// socket.io
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_ENDPOINT
    }
})

io.on('connection', (socket) => {
    logger.info('socket io connected successfully.')

    SocketServer(socket)
})

// handle errors server

const exitHandler = () => {
    if(server) {
        logger.info('Server closed')
        process.exit(1)
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

// SIGNTERM
process.on('SIGNTERM', () => {
    if(server) {
        logger.info('Server closed')
        process.exit(1)
    }
})