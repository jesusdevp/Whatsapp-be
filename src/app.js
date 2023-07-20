import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import cors from 'cors'

// dot config
dotenv.config()

// create express app
const app = express()

// morgan
if( process.env.NODE_ENV !== 'production' ) {
    app.use( morgan('dev') )
}

// helmet
app.use( helmet() )

// parse JSON request url
app.use( express.json() )

// parse JSON request body
app.use( express.urlencoded({ extended: true }) )

// sanitize request data
app.use( mongoSanitize() )

// enabled cookie parser
app.use( cookieParser() )

// gzip compression
app.use( compression() )

// file upload
app.use( fileUpload({
    useTempFiles: true
}))

// cors
app.use( cors() )

app.post( '/test', ( req, res ) => {
    res.send( req.body )
})

export default app;