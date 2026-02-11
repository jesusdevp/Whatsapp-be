import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import createHttpError from 'http-errors'
import routes from './routes/index.js'

dotenv.config()

const app = express()

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(cookieParser())
app.use(compression())

app.use(fileUpload({
    useTempFiles: true
}))

export const allowedOrigins = [process.env.CLIENT_ENDPOINT, 'http://localhost:5173'].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// routes
app.use('/api/v1', routes)

app.use(async (req, res, next) => {
    next(createHttpError.NotFound('This route does not exist'))
})

app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

export default app
